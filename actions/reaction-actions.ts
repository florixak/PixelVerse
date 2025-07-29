"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { writeClient } from "@/sanity/lib/client";
import { isPostContent, Post, Comment } from "@/sanity.types";
import {
  getUserReaction as getLibUserReaction,
  getReactionCounts as getLibReactionCounts,
  getReactions as getLibReactions,
  GetReactions,
  GetReactionCounts,
  GetUserReaction,
} from "@/sanity/lib/reactions/getReactionsById";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";

export async function handleReaction(
  target: Post | Comment,
  reactionType: string | null
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await getUserByClerkId(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const targetType = isPostContent(target) ? "post" : "comment";

    const existingReaction = await getLibUserReaction(target._id, userId);

    if (reactionType === null) {
      if (existingReaction) {
        await writeClient.delete(existingReaction._id);
        revalidateTag(`reactions-${targetType}-${target._id}`);
        return { success: true, action: "removed" };
      }
      return { success: true, action: "no-change" };
    }

    if (existingReaction) {
      await writeClient
        .patch(existingReaction._id)
        .set({ type: reactionType })
        .commit();
      revalidateTag(`reactions-${targetType}-${target._id}`);
      return { success: true, action: "updated", type: reactionType };
    }

    const reactionData = {
      _type: "reaction",
      user: { _type: "reference", _ref: user._id },
      type: reactionType,
      content: {
        _type: "reference",
        _ref: target._id,
      },
    };

    const newReaction = await writeClient.create(reactionData);
    revalidateTag(`reactions-${targetType}-${target._id}`);

    return {
      success: true,
      action: "created",
      type: reactionType,
      _id: newReaction._id,
    };
  } catch (error) {
    console.error("Failed to handle reaction:", error);
    return { success: false, error: "Failed to handle reaction" };
  }
}

export async function getReactions(
  target: Post | Comment,
  userId: string | undefined
): Promise<{
  success: boolean;
  data?: {
    reactions: GetReactions[];
    reactionCounts: GetReactionCounts;
    userReaction: GetUserReaction;
  };
  error?: string;
}> {
  try {
    if (!target || !target._id) {
      return { success: false, error: "Invalid target" };
    }
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const [reactions, reactionCounts, userReaction] = await Promise.all([
      getLibReactions(target._id),
      getLibReactionCounts(target._id),
      getLibUserReaction(target._id, userId),
    ]);

    return {
      success: true,
      data: {
        reactions: reactions,
        reactionCounts: reactionCounts,
        userReaction: userReaction,
      },
    };
  } catch (error) {
    console.error("Failed to get reactions:", error);
    return { success: false, error: "Failed to get reactions" };
  }
}
