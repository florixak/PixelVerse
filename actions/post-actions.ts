"use server";

import { writeClient } from "@/sanity/lib/client";
import { ensureSanityUser } from "@/lib/user-utils";
import { Comment, Post, Reaction, Report } from "@/sanity.types";
import { revalidatePath } from "next/cache";
import {
  uploadImageAsset,
  generateUniqueSlug,
  validateTopicExists,
  getTopicSlug,
  parsePostFormData,
} from "@/lib/post-utils";
import { createNotification } from "./notification-actions";

/**
 * Creates a new post
 */
export async function createPost(formData: FormData) {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      throw new Error("Must be logged in");
    }

    const postData = parsePostFormData(formData);

    if (!(await validateTopicExists(postData.topicId))) {
      throw new Error(`Topic with ID "${postData.topicId}" does not exist`);
    }

    const imageAsset = await uploadImageAsset(postData.imageFile);

    const finalSlug = await generateUniqueSlug(postData.title);

    const newPost = await writeClient.create({
      _type: "post",
      title: postData.title,
      slug: {
        _type: "slug",
        current: finalSlug,
      },
      image: imageAsset,
      content: postData.content,
      excerpt: postData.content.substring(0, 150),
      topic: {
        _type: "reference",
        _ref: postData.topicId,
      },
      author: {
        _type: "reference",
        _ref: userId,
      },
      disabledComments: postData.disabledComments,
      createdAt: new Date().toISOString(),
      postType: postData.postType,
      dimensions: postData.dimensions,
      software: postData.software,
      tags: postData.tags,
      isOriginal: postData.isOriginal,
      colorPalette: postData.colorPalette,
      tutorialSteps: postData.tutorialSteps,
    });

    const topicSlug = await getTopicSlug(postData.topicId);

    return {
      ...newPost,
      slug: newPost.slug?.current || finalSlug,
      topicSlug,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

/**
 * Updates an existing post
 */
export async function updatePost(
  formData: FormData,
  postId: string
): Promise<{ newSlug: string; topicSlug: string }> {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Verify user owns the post
    const post = await writeClient.fetch(
      `*[_type == "post" && _id == $postId && author._ref == $userId][0]`,
      { postId, userId }
    );

    if (!post) {
      throw new Error("You are not authorized to update this post");
    }

    const postData = parsePostFormData(formData);

    const imageAsset = await uploadImageAsset(postData.imageFile);

    let finalSlug = post.slug.current || "untitled";
    if (postData.title !== post.title) {
      finalSlug = await generateUniqueSlug(postData.title);
    }

    const updateData: any = {
      title: postData.title,
      slug: {
        _type: "slug",
        current: finalSlug,
      },
      content: postData.content,
      excerpt: postData.content.substring(0, 150),
      updatedAt: new Date().toISOString(),
      postType: postData.postType,
      disabledComments: postData.disabledComments,
      topic: {
        _type: "reference",
        _ref: postData.topicId,
      },
      dimensions: postData.dimensions,
      software: postData.software,
      tags: postData.tags,
      isOriginal: postData.isOriginal,
      colorPalette: postData.colorPalette,
      tutorialSteps: postData.tutorialSteps,
    };

    if (postData.postType === "tutorial") {
      if (!postData.tutorialSteps || postData.tutorialSteps.length === 0) {
        throw new Error("Tutorial posts must have at least one step");
      }
      updateData.tutorialSteps = postData.tutorialSteps.map(
        (step: any, index: number) => ({
          ...step,
          _key: `step-${index}-${Date.now()}`,
        })
      );
    }

    if (imageAsset) {
      updateData.image = imageAsset;
    }

    const updatedPost = await writeClient
      .patch(postId)
      .set(updateData)
      .commit();

    const topicSlug = await getTopicSlug(postData.topicId);

    return {
      newSlug: updatedPost.slug?.current || finalSlug,
      topicSlug,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }
}

/**
 * Soft deletes a post (sets isDeleted flag)
 */
export async function deletePost(postId: Post["_id"]) {
  const userId = await ensureSanityUser();
  if (!userId) throw new Error("Must be logged in");

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

// ================================
// REACTION ACTIONS
// ================================

/**
 * Handles user reactions on posts (like/dislike)
 */
export async function reactOnPost(
  postId: Post["_id"],
  reaction: Reaction["type"]
) {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Check if user already reacted to this post
    const existingReaction = await writeClient.fetch(
      `*[_type == "reaction" && post._ref == $postId && user._ref == $userId][0]`,
      { postId, userId }
    );

    if (existingReaction) {
      if (existingReaction.type === reaction) {
        // Remove reaction if same type
        await writeClient.delete(existingReaction._id);
        return { success: true, action: "removed" };
      } else {
        // Update reaction type
        await writeClient
          .patch(existingReaction._id)
          .set({ type: reaction })
          .commit();
        return { success: true, action: "updated" };
      }
    } else {
      // Create new reaction
      await writeClient.create({
        _type: "reaction",
        type: reaction,
        post: {
          _type: "reference",
          _ref: postId,
        },
        user: {
          _type: "reference",
          _ref: userId,
        },
      });
      return { success: true, action: "created" };
    }
  } catch (error) {
    console.error("Error reacting to post:", error);
    throw new Error("Failed to react to post");
  }
}

// ================================
// COMMENT ACTIONS
// ================================

/**
 * Creates a new comment on a post
 */
export async function createComment({
  postId,
  content,
}: {
  postId: Post["_id"];
  content: Comment["content"];
}) {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      return { error: "You must be logged in to comment" };
    }

    if (!content?.trim()) {
      return { error: "Comment cannot be empty" };
    }

    const post = await writeClient.fetch<Post>(
      `*[_type == "post" && _id == $postId && isDeleted != true && isBanned != true][0] {
        _id,
        _type,
        title,
        author-> {_id,}
      }`,
      { postId }
    );

    if (!post) {
      return { error: "Post does not exist or has been deleted" };
    }

    if (post.disabledComments) {
      return { error: "Comments are disabled for this post" };
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

    await createNotification({
      recipientId: post?.author?._id!,
      senderId: userId,
      type: "comment",
      message: ` commented on your post `,
      contentId: postId,
    });

    revalidatePath(`/topics/${post.topicSlug}/${post.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to post comment" };
  }
}

/**
 * Deletes a comment (user can only delete their own)
 */
export async function deleteComment(commentId: Post["_id"]) {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Verify user owns the comment
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

/**
 * Updates a comment (user can only update their own)
 */
export async function updateComment(
  commentId: Post["_id"],
  newContent: Comment["content"]
) {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      return { error: "You must be logged in to update a comment" };
    }

    // Verify user owns the comment
    const comment = await writeClient.fetch(
      `*[_type == "comment" && _id == $commentId && author._ref == $userId][0]`,
      { commentId, userId }
    );

    if (!comment) {
      return { error: "You are not authorized to update this comment" };
    }

    await writeClient
      .patch(commentId)
      .set({ isEdited: true, content: newContent })
      .commit();
    return { success: true };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { error: "Failed to update comment" };
  }
}

// ================================
// REPORTING ACTIONS
// ================================

/**
 * Submits a report for content (posts or comments)
 */
export async function submitReport(
  contentId: string,
  reason: Report["reason"],
  additionalInfo: string | undefined,
  contentType: Report["contentType"]
) {
  try {
    const userId = await ensureSanityUser();

    if (!userId) {
      throw new Error("Must be logged in");
    }

    const contentExists = await writeClient.fetch(
      `*[_type == $contentType && _id == $contentId][0]._id`,
      { contentType, contentId }
    );

    if (!contentExists) {
      return {
        success: false,
        error: `The ${contentType} you're trying to report doesn't exist`,
      };
    }

    const existingReport = await writeClient.fetch(
      `*[_type == "report" && content._ref == $contentId && reporter._ref == $userId][0]._id`,
      { contentId, userId }
    );

    if (existingReport) {
      return {
        success: false,
        error: `You've already reported this ${contentType}`,
      };
    }

    const reportCount = await writeClient.fetch('count(*[_type == "report"])');
    const displayId = `REP-${(reportCount + 1).toString().padStart(4, "0")}`;

    await writeClient
      .patch(contentId)
      .setIfMissing({ reportCount: 0 })
      .inc({ reportCount: 1 })
      .commit();

    const report = await writeClient.create({
      _type: "report",
      displayId,
      contentType,
      content: {
        _type: "reference",
        _ref: contentId,
      },
      reporter: {
        _type: "reference",
        _ref: userId,
      },
      reason,
      additionalInfo: additionalInfo?.trim() || undefined,
      reportedAt: new Date().toISOString(),
      status: "pending",
    });

    revalidatePath("/admin/reports");

    if (contentType === "post") {
      const post = await writeClient.fetch(
        `*[_type == "post" && _id == $contentId][0]{ 
          "slug": slug.current, 
          "topicSlug": topic->slug.current 
        }`,
        { contentId }
      );
      if (post) {
        revalidatePath(`/topics/${post.topicSlug}/${post.slug}`);
      }
    } else if (contentType === "comment") {
      const comment = await writeClient.fetch(
        `*[_type == "comment" && _id == $contentId][0]{ 
          "postSlug": post->slug.current, 
          "topicSlug": post->topic->slug.current 
        }`,
        { contentId }
      );
      if (comment) {
        revalidatePath(`/topics/${comment.topicSlug}/${comment.postSlug}`);
      }
    }

    return { success: true, error: null, reportId: report._id };
  } catch (error) {
    console.error(`Error reporting ${contentType}:`, error);
    return {
      error: `Failed to report ${contentType}. Please try again.`,
      success: false,
    };
  }
}
