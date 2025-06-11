"use server";

import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import slugify from "slugify";
import { ensureSanityUser } from "@/lib/user-utils";
import { Post, Reaction, Report } from "@/sanity.types";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Must be logged in");

    const userId = await ensureSanityUser(user);

    const topicId = formData.get("topic")?.toString() || "";

    console.log("Creating post with topicId:", topicId);

    const topicExists = await writeClient.fetch(
      `*[_type == "topic" && _id == $topicId][0]._id`,
      { topicId }
    );

    if (!topicExists) {
      throw new Error(`Topic with ID "${topicId}" does not exist`);
    }

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
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function updatePost(formData: FormData, postId: string) {}

export async function deletePost(postId: string) {
  const user = await currentUser();
  if (!user) throw new Error("Must be logged in");

  const userId = await ensureSanityUser(user);

  const post = await writeClient.fetch<Post>(
    `*[_type == "post" && _id == $postId && author._ref == $userId][0]`,
    { postId, userId }
  );

  if (!post) {
    throw new Error("You are not authorized to delete this post");
  }

  await writeClient.patch(postId).set({ isDeleted: true }).commit();
  revalidatePath(`/topics/${post.topicSlug}/${post.slug}`);
}

export async function reactOnPost(postId: string, reaction: Reaction["type"]) {}

export async function createComment(prevState: any, formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to comment" };
    }

    const userId = await ensureSanityUser(user);
    const postInformation = formData.get("postInformation") as string;
    const {
      postId,
      topicSlug,
      postSlug,
    }: {
      postId: Post["_id"];
      topicSlug: Post["topicSlug"];
      postSlug: Post["slug"];
    } = JSON.parse(postInformation);
    const content = formData.get("content") as string;

    if (!content?.trim()) {
      return { error: "Comment cannot be empty" };
    }

    await writeClient.create({
      _type: "comment",
      content,
      post: {
        _type: "reference",
        _ref: postId,
      },
      author: {
        _type: "reference",
        _ref: userId,
      },
      publishedAt: new Date().toISOString(),
    });

    revalidatePath(`/topics/${topicSlug}/${postSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to post comment" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to delete a comment" };
    }

    const userId = await ensureSanityUser(user);

    const comment = await writeClient.fetch(
      `*[_type == "comment" && _id == $commentId && author._ref == $userId][0]`,
      { commentId, userId }
    );

    if (!comment) {
      return { error: "You are not authorized to delete this comment" };
    }

    await writeClient.delete(commentId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
}

export async function reportPost(
  postId: Post["_id"],
  reason: Report["reason"],
  additionalInfo?: Report["additionalInfo"]
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: "You must be logged in to report a post",
      };
    }

    const userId = await ensureSanityUser(user);

    await writeClient.create({
      _type: "report",
      post: {
        _type: "reference",
        _ref: postId,
      },
      reporter: {
        _type: "reference",
        _ref: userId,
      },
      additionalInfo: additionalInfo?.trim() || "",
      reason,
      reportedAt: new Date().toISOString(),
      status: "pending",
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Error reporting post:", error);
    return { error: "Failed to report post", success: false };
  }
}
