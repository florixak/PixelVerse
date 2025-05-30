"use server";

import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import slugify from "slugify";
import addUser from "@/sanity/lib/users/addUser";

export async function createPost(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Must be logged in");

  const existingUser = await writeClient.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]`,
    { clerkId: user.id }
  );

  let userId = existingUser?._id;
  if (!existingUser) {
    console.log("Creating new user in Sanity");
    const newUser = await addUser({
      clerkId: user.id,
      username: user.username || user.firstName || "Anonymous",
      fullName: user.fullName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      imageUrl: user.imageUrl || "",
    });
    userId = newUser._id;
  } else {
    console.log("User already exists in Sanity");
  }

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
