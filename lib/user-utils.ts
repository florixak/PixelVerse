import { User as UserType } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import addUser from "@/sanity/lib/users/addUser";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { auth, currentUser, User } from "@clerk/nextjs/server";

export async function getOrCreateSanityUser(): Promise<UserType | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const existingUser = await getUserByClerkId(userId);
    if (existingUser) {
      return existingUser;
    }

    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    try {
      const newUser = await addUser({
        clerkId: clerkUser.id,
        username:
          clerkUser.username ||
          clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
          `user_${userId.slice(-6)}`,
        fullName: clerkUser.fullName || clerkUser.firstName || "New User",
        email: clerkUser.emailAddresses[0]?.emailAddress,
        imageUrl: clerkUser.imageUrl,
      });

      return newUser;
    } catch (createError) {
      console.error("Failed to create user:", createError);
      return null;
    }
  } catch (error) {
    console.error("Error in getOrCreateSanityUser:", error);
    return null;
  }
}

export async function getSanityUser(): Promise<UserType | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    return await getUserByClerkId(userId);
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function ensureSanityUser(): Promise<UserType["_id"] | null> {
  try {
    const user = await getOrCreateSanityUser();
    return user?._id || null;
  } catch (error) {
    console.error("Error in ensureSanityUser:", error);
    return null;
  }
}

export const ensureUniqueUsername = async (
  username: string
): Promise<string> => {
  const sanitizedUsername = username
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .trim();

  const existingUsers: User[] = await writeClient.fetch(
    `*[_type == "user" && username match $usernamePattern] { username }`,
    { usernamePattern: `${sanitizedUsername}*` }
  );

  if (existingUsers.length === 0) {
    return sanitizedUsername;
  }

  const suffixPattern = new RegExp(`^${sanitizedUsername}(\\d+)$`);
  let highestSuffix = 0;

  existingUsers.forEach((user) => {
    if (typeof user.username === "string") {
      const match = user.username.match(suffixPattern);
      if (match && match[1]) {
        const suffix = parseInt(match[1], 10);
        highestSuffix = Math.max(highestSuffix, suffix);
      }
    }
  });

  return `${sanitizedUsername}${highestSuffix + 1}`;
};

export const canAccessDashboard = async (
  clerkId: UserType["clerkId"]
): Promise<boolean> => {
  if (!clerkId) return false;
  const user = await getUserByClerkId(clerkId);
  return user?.role === "admin" || user?.role === "moderator";
};

export const isUserAdmin = async (clerkId: string): Promise<boolean> => {
  const user = await getUserByClerkId(clerkId);
  return user?.role === "admin";
};

export async function checkAdminAuth() {
  const { userId } = await auth();
  if (!userId) {
    return {
      isAuthorized: false,
      error: "You must be logged in to perform this action.",
    };
  }

  const user = await getUserByClerkId(userId);
  if (!user || user.role !== "admin") {
    return {
      isAuthorized: false,
      error: "You do not have permission to perform this action.",
    };
  }

  return {
    isAuthorized: true,
    user,
  };
}
