import { writeClient } from "../client";
import { ensureUniqueUsername } from "@/lib/user-utils";

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
}) => {
  if (!clerkId || !username || !email) {
    throw new Error("clerkId, username, and email are required");
  }

  return writeClient.create({
    _type: "user",
    clerkId,
    username: await ensureUniqueUsername(username),
    fullName,
    email,
    imageUrl,
    createdAt: new Date().toISOString(),
  });
};

export default addUser;
