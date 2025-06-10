"use server";

import { isUserAdmin } from "@/lib/user-utils";
import { User } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (
  userId: User["_id"],
  newRole: User["role"]
): Promise<{
  success: boolean;
  user?: User | null;
  message?: string;
}> => {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    const canUpdateRole = await isUserAdmin(currentUserId);
    if (!canUpdateRole) {
      return {
        success: false,
        message: "You do not have permission to update user roles.",
      };
    }

    if (!userId || !newRole) {
      return {
        success: false,
        message: "User ID and new role are required.",
      };
    }

    const updatedUser = await writeClient
      .patch(userId)
      .set({ role: newRole })
      .commit();

    revalidatePath("/admin/users");

    return {
      success: true,
      user: updatedUser as User,
      message: `User role updated to ${newRole}.`,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error(
      `Failed to update user role: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const removeUser = async (
  userId: User["_id"]
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required.",
      };
    }
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }
    const currentUser = await getUserByClerkId(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: true,
        message: "User removal functionality is not implemented yet.",
      };
    }

    const removedUser = await writeClient.delete(userId);
    revalidatePath("/admin/users");
    if (!removedUser) {
      return {
        success: false,
        message: "Failed to remove user. User not found or already deleted.",
      };
    }

    return {
      success: true,
      message: `User with ID ${userId} has been successfully removed.`,
    };
  } catch (error) {
    console.error("Error removing user:", error);
    return {
      success: false,
      message: `Failed to remove user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
