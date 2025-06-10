import { User as UserType } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import addUser from "@/sanity/lib/users/addUser";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { User } from "@clerk/nextjs/server";

export async function ensureSanityUser(user: User): Promise<UserType["_id"]> {
  if (!user) throw new Error("No user provided");

  const existingUser = await writeClient.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]`,
    { clerkId: user.id }
  );

  if (existingUser) {
    return existingUser._id;
  }

  const newUser = await addUser({
    clerkId: user.id,
    username: user.username || user.firstName || "Anonymous",
    fullName: user.fullName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    imageUrl: user.imageUrl || "",
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

export const canAccessDashboard = async (clerkId: string): Promise<boolean> => {
  const user = await getUserByClerkId(clerkId);
  return user?.role === "admin" || user?.role === "moderator";
};

export const isUserAdmin = async (clerkId: string): Promise<boolean> => {
  const user = await getUserByClerkId(clerkId);
  return user?.role === "admin";
};
