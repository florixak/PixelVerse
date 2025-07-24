import { User as UserType } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import addUser from "@/sanity/lib/users/addUser";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { auth, clerkClient, User } from "@clerk/nextjs/server";

export async function ensureSanityUser(
  userId: string
): Promise<UserType["_id"]> {
  if (!userId) throw new Error("No user ID provided");

  const sanityUser = await writeClient.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]`,
    { clerkId: userId }
  );

  if (sanityUser) {
    return sanityUser;
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  if (!user) throw new Error("No user provided");

  const newUser = await addUser({
    clerkId: user.id,
    username:
      user.username ||
      user.emailAddresses[0]?.emailAddress.split("@")[0] ||
      `user_${userId.slice(-6)}`,
    fullName: user.fullName || user.firstName || "New User",
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
  });

  return newUser._id;
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
