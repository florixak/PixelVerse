"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";

export async function isFollowingUser(targetUserId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }
    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }
    const follow = await writeClient.fetch(
      `*[_type == "follow" && follower._ref == $followerId && following._ref == $followingId][0]`,
      { followerId: currentUser._id, followingId: targetUserId },
      {
        useCdn: false,
        perspective: "published",
      }
    );
    return { success: true, isFollowing: !!follow };
  } catch (error) {
    console.error("Failed to check following status:", error);
    return { success: false, error: "Failed to check following status" };
  }
}

export async function followUser(targetUserId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    if (currentUser._id === targetUserId) {
      return { success: false, error: "Cannot follow yourself" };
    }

    const existingFollow = await writeClient.fetch(
      `*[_type == "follow" && follower._ref == $followerId && following._ref == $followingId][0]`,
      { followerId: currentUser._id, followingId: targetUserId },
      {
        useCdn: false,
        perspective: "published",
      }
    );

    if (existingFollow) {
      return { success: false, error: "Already following this user" };
    }

    await writeClient.create({
      _type: "follow",
      follower: { _type: "reference", _ref: currentUser._id },
      following: { _type: "reference", _ref: targetUserId },
      createdAt: new Date().toISOString(),
    });

    return { success: true, action: "followed" };
  } catch (error) {
    console.error("Failed to follow user:", error);
    return { success: false, error: "Failed to follow user" };
  }
}

export async function unfollowUser(targetUserId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const existingFollow = await writeClient.fetch(
      `*[_type == "follow" && follower._ref == $followerId && following._ref == $followingId][0]`,
      { followerId: currentUser._id, followingId: targetUserId },
      {
        useCdn: false,
        perspective: "published",
      }
    );

    if (!existingFollow) {
      return { success: false, error: "Not following this user" };
    }

    await writeClient.delete(existingFollow._id);

    return { success: true, action: "unfollowed" };
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    return { success: false, error: "Failed to unfollow user" };
  }
}
