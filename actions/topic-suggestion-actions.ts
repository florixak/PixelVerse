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

  const iconAsset = await uploadImageAsset(icon, 1 * 1024 * 1024);
  const bannerAsset = await uploadImageAsset(banner, 2 * 1024 * 1024);

  if (!title || !description || !iconAsset || !bannerAsset) {
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

  /*const aiResult = await moderateTopicSuggestion({
    title,
    description,
  });*/

  const topic = {
    _type: "suggestedTopic",
    title,
    slug: { current: baseSlug },
    description,
    /*status: getStatusFromAI(aiResult),
    aiModerationResult: {
      _type: "aiModerationResult",
      isApproved: aiResult.isApproved,
      suitabilityScore: aiResult.suitabilityScore,
      categories: aiResult.categories,
      reasons: aiResult.reasons,
      suggestions: aiResult.suggestions,
      checkedAt: new Date().toISOString(),
      confidence: aiResult.confidence,
    },*/
    submittedBy: { _type: "reference", _ref: sanityUser._id },
    submittedAt: new Date().toISOString(),
  };

  const suggestedTopic = await writeClient.create(topic);
  if (!suggestedTopic) {
    return {
      success: false,
      error: "Failed to create topic. Please try again.",
    };
  }

  revalidatePath(`/admin/suggested-topics`);

  return {
    success: true,
  };
};

const getStatusFromAI = (aiResult: any): string => {
  const { isApproved, suitabilityScore, confidence } = aiResult;

  if (isApproved && suitabilityScore >= 0.8 && confidence >= 0.85) {
    return "ai_approved";
  }

  if (
    suitabilityScore < 0.3 ||
    aiResult.categories?.includes("inappropriate")
  ) {
    return "ai_rejected";
  }

  if (confidence < 0.7 || (suitabilityScore >= 0.3 && suitabilityScore < 0.7)) {
    return "needs_human_review";
  }

  return "ai_approved";
};

const getStatusMessage = (status: string, aiResult: any): string => {
  const score = Math.round(aiResult.suitabilityScore * 100);

  switch (status) {
    case "ai_approved":
      return `🎉 Great suggestion! AI approved with ${score}% suitability. Your topic will be reviewed by moderators and published soon.`;

    case "ai_rejected":
      return `❌ This topic doesn't seem suitable for our pixel art community (${score}% suitability). ${
        aiResult.suggestions?.[0] ||
        "Please try a topic related to pixel art, retro gaming, or digital creativity."
      }`;

    case "needs_human_review":
      return `🔍 Your suggestion needs human review. AI found it ${score}% suitable but wants a moderator to take a closer look. This helps ensure quality!`;

    default:
      return "Topic submitted for review.";
  }
};
