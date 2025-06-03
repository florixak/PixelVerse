"use server";

import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import slugify from "slugify";
import { ensureSanityUser } from "@/lib/user-utils";
import { Reaction } from "@/sanity.types";

export async function createPost(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Must be logged in");

  const userId = await ensureSanityUser(user);

  const topicId = formData.get("topic")?.toString() || "";
  const postTitle = formData.get("title")?.toString() || "Untitled Post";

  const imageFile = formData.get("image") as File;
  let imageAsset = null;

  if (imageFile && imageFile.size > 0) {
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    imageAsset = await writeClient.assets.upload("image", imageBuffer, {
      filename: imageFile.name,
      contentType: imageFile.type,
    });
  }

  let baseSlug = slugify(postTitle, { lower: true, strict: true });

  const existingSlugs = await writeClient.fetch(
    `*[_type == "post" && slug.current == $slug].slug.current`,
    { slug: baseSlug }
  );

  let finalSlug = baseSlug;
  if (existingSlugs.length > 0) {
    finalSlug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  const newPost = await writeClient.create({
    _type: "post",
    title: postTitle,
    slug: {
      _type: "slug",
      current: finalSlug,
    },
    image: imageAsset
      ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        }
      : null,
    content: formData.get("content")?.toString() || "",
    excerpt: formData.get("content")?.toString().substring(0, 150) || "",
    topic: {
      _type: "reference",
      _ref: formData.get("topic")?.toString() || "",
    },
    author: {
      _type: "reference",
      _ref: userId,
    },
    publishedAt: new Date().toISOString(),
    postType: "pixelArt",
    tags:
      formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((tag) => tag.trim()) || [],
  });

  const topic = await writeClient.fetch(
    `*[_type == "topic" && _id == $topicId][0]`,
    { topicId }
  );

  return {
    ...newPost,
    topicSlug: topic?.slug || "unknown",
  };
}

export async function updatePost(formData: FormData, postId: string) {}

export async function deletePost(postId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Must be logged in");

  const userId = await ensureSanityUser(user);

  const post = await writeClient.fetch(
    `*[_type == "post" && _id == $postId && author._ref == $userId][0]`,
    { postId, userId }
  );

  if (!post) {
    throw new Error("You are not authorized to delete this post");
  }

  await writeClient.patch(postId).set({ isDeleted: true }).commit();
}

export async function reactOnPost(postId: string, reaction: Reaction["type"]) {}
