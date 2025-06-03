import { writeClient } from "@/sanity/lib/client";
import addUser from "@/sanity/lib/users/addUser";
import { User } from "@clerk/nextjs/server";

export async function ensureSanityUser(user: User): Promise<string> {
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
