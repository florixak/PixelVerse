"use server";

import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import slugify from "slugify";
import { ensureSanityUser } from "@/lib/user-utils";

export async function createPost(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Must be logged in");

  const userId = await ensureSanityUser(user);

  const topicId = formData.get("topic")?.toString() || "";
  const postTitle = formData.get("title")?.toString() || "Untitled Post";

  const newPost = await writeClient.create({
    _type: "post",
    title: postTitle,
    slug: {
      _type: "slug",
      current: slugify(postTitle, { lower: true, strict: true }),
    },
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

export async function updatePost(formData: FormData, postId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Must be logged in");

  const userId = await ensureSanityUser(user);

  const postTitle = formData.get("title")?.toString() || "Untitled Post";

  const updatedPost = await writeClient.patch(postId).set({
    title: postTitle,
    slug: {
      _type: "slug",
      current: slugify(postTitle, { lower: true, strict: true }),
    },
    content: formData.get("content")?.toString() || "",
    excerpt: formData.get("content")?.toString().substring(0, 150) || "",
    topic: {
      _type: "reference",
      _ref: formData.get("topic")?.toString() || "",
    },
  });
}
