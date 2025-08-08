"use server";

import { ProfileData } from "@/components/user/user-profile-edit-form";
import {
  Comment,
  Post,
  Reaction,
  Report,
  SuggestedTopic,
  User,
} from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateProfile = async (formData: ProfileData) => {
  try {
    const { fullName, username, bio } = formData;

    if (!fullName || !bio || !username) {
      throw new Error("All fields are required.");
    }

    const user = await currentUser();
    if (!user) {
      throw new Error("You must be logged in to update your profile.");
    }
    const sanityUser = await getUserByClerkId(user.id);
    if (!sanityUser) {
      throw new Error("User not found in Sanity.");
    }

    const userId = sanityUser._id;

    const existingUser = await writeClient.fetch(
      `*[_type == "user" && username == $username && _id != $userId][0]`,
      { username, userId }
    );

    if (existingUser) {
      return {
        success: false,
        message: "Username already exists. Please choose a different username.",
      };
    }

    const updatedProfile = await writeClient
      .patch(userId)
      .set({
        fullName,
        bio,
        username,
      })
      .commit();

    revalidatePath(`/user/${sanityUser.username}`);

    return {
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const deleteUserAccount = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const deleteQueries = [
      `*[_type == "post" && author._ref == "${userId}"]`,
      `*[_type == "reaction" && user._ref == "${userId}"]`,
      `*[_type == "comment" && author._ref == "${userId}"]`,
      `*[_type == "suggestedTopic" && author._ref == "${userId}"]`,
      `*[_type == "report" && reportedBy._ref == "${userId}"]`,
      `*[_type == "user" && clerkId == "${userId}"]`,
    ];

    for (const query of deleteQueries) {
      const documents = await writeClient.fetch(query);
      if (documents.length > 0) {
        const deleteTransaction = writeClient.transaction();
        documents.forEach(
          (doc: User | Post | Reaction | Comment | SuggestedTopic | Report) => {
            deleteTransaction.delete(doc._id);
          }
        );
        await deleteTransaction.commit();
      }
    }

    (await clerkClient()).users.deleteUser(userId);

    revalidatePath("/");

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return {
      success: false,
      message: "Failed to delete account. Please try again.",
    };
  }
};
