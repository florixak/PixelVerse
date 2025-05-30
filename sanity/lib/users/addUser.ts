import { writeClient } from "../client";

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
  return writeClient.create({
    _type: "user",
    clerkId,
    username,
    fullName,
    email,
    imageUrl,
    createdAt: new Date().toISOString(),
  });
};

export default addUser;
