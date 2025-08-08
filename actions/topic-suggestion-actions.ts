"use server";

import {
  parseTopicSuggestionFormData,
  uploadImageAsset,
} from "@/lib/post-utils";
import { writeClient } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import slugify from "slugify";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { revalidatePath } from "next/cache";
import { checkTopicSuggestionByAI } from "./ai-moderation";
import { addTopic } from "./topic-actions";
import { SuggestedTopic } from "@/sanity.types";
import { getSuggestedTopicById } from "@/sanity/lib/suggested-topics/getSuggestedTopicById";

export const suggestTopic = async (
  formData: FormData
): Promise<{ success: boolean; error?: string }> => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to suggest a topic.",
    };
  }

  const sanityUser = await getUserByClerkId(user.id);

  if (!sanityUser) {
    return {
      success: false,
      error: "User not found in Sanity.",
    };
  }

  const { title, description, icon, banner } =
    parseTopicSuggestionFormData(formData);

  if (!title || !description || !icon || !banner) {
    return {
      success: false,
      error: "All fields are required and images must be valid.",
    };
  }

  let baseSlug = slugify(title, { lower: true, strict: true });

  const existingSlugs = await writeClient.fetch(
    `*[_type == "topic" && slug.current == $slug].slug.current`,
    { slug: baseSlug }
  );

  if (existingSlugs.length > 0) {
    return {
      success: false,
      error:
        "A topic with this title already exists. Please choose a different title.",
    };
  }

  const [iconResult, bannerResult] = await Promise.allSettled([
    uploadImageAsset(icon, 1 * 1024 * 1024),
    uploadImageAsset(banner, 2 * 1024 * 1024),
  ]);

  let iconAsset, bannerAsset;

  if (iconResult.status === "fulfilled") {
    iconAsset = iconResult.value;
  } else {
    iconAsset = undefined;
  }

  if (bannerResult.status === "fulfilled") {
    bannerAsset = bannerResult.value;
  } else {
    bannerAsset = undefined;
  }

  const aiResult = await checkTopicSuggestionByAI(title, description);

  const newSuggestedTopic = {
    _type: "suggestedTopic",
    title,
    slug: { current: baseSlug },
    description,
    status: aiResult.recommendedAction,
    aiModerationResult: {
      _type: "aiModerationResult",
      isApproved: aiResult.isApproved,
      suitabilityScore: aiResult.suitabilityScore,
      categories: aiResult.categories,
      reasons: aiResult.reasons,
      suggestions: aiResult.suggestions,
      checkedAt: new Date().toISOString(),
      confidence: aiResult.confidence,
    },
    icon: iconAsset,
    banner: bannerAsset,
    submittedBy: { _type: "reference", _ref: sanityUser._id },
    submittedAt: new Date().toISOString(),
  };

  const suggestedTopic = await writeClient.create(newSuggestedTopic);
  if (!suggestedTopic) {
    return {
      success: false,
      error: "Failed to create topic. Please try again.",
    };
  }

  if (aiResult.isApproved && aiResult.recommendedAction === "published") {
    const publishedTopic = {
      _type: "topic",
      title,
      slug: { current: baseSlug },
      description,
      icon: iconAsset,
      banner: bannerAsset,
    };
    await writeClient.create(publishedTopic);
    revalidatePath(`/topics`);
  }

  revalidatePath(`/admin/suggested-topics`);

  return {
    success: true,
  };
};

export const approveTopic = async (id: string): Promise<void> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to approve a topic.");
  }

  const sanityUser = await getUserByClerkId(user.id);

  if (!sanityUser) {
    throw new Error("User not found in Sanity.");
  }

  const suggestedTopic = await getSuggestedTopicById(id);

  if (!suggestedTopic) {
    throw new Error("Topic not found.");
  }

  const topic = {
    title: suggestedTopic.title,
    slug: suggestedTopic.slug,
    description: suggestedTopic.description,
    icon: suggestedTopic.icon,
    banner: suggestedTopic.banner,
  };

  await Promise.all([
    writeClient.patch(id).set({ status: "published" }).commit(),
    addTopic(topic),
  ]);

  revalidatePath(`/admin/suggested-topics/${id}`);
};

export const rejectTopic = async (id: string): Promise<void> => {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to reject a topic.");
  }

  const sanityUser = await getUserByClerkId(user.id);

  if (!sanityUser) {
    throw new Error("User not found in Sanity.");
  }

  const suggestedTopic = await getSuggestedTopicById(id);

  if (!suggestedTopic) {
    throw new Error("Topic not found.");
  }

  await writeClient.patch(id).set({ status: "rejected" }).commit();

  revalidatePath(`/admin/suggested-topics/${id}`);
};
