import { ensureUniqueUsername } from "@/lib/user-utils";
import { writeClient } from "../client";
import { User } from "@/sanity.types";

const addUser = async ({
  clerkId,
  username,
  fullName,
  email,
  imageUrl,
}: {
  clerkId: string;
  username: string;
  email: string;
  fullName?: string;
  imageUrl?: string;
}): Promise<User> => {
  if (!clerkId || !username || !email) {
    throw new Error("clerkId, username, and email are required");
  }

  const uniqueUsername = await ensureUniqueUsername(username);

  return writeClient.create({
    _type: "user",
    clerkId,
    username: uniqueUsername,
    fullName,
    email,
    imageUrl,
    createdAt: new Date().toISOString(),
    role: "user",
  });
};

export default addUser;
