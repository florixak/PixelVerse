"use server";

import { ProfileData } from "@/components/user/user-profile-edit-form";
import { writeClient } from "@/sanity/lib/client";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";
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
