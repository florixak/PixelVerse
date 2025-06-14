import { groq } from "next-sanity";
import { client } from "../client";
import { User } from "@/sanity.types";

export async function getRecentUsers(limit = 5): Promise<User[]> {
  return client.fetch(
    groq`*[_type == "user"] | order(_createdAt desc) [0...$limit] {
      _id,
      username,
      fullName,
      email,
      imageUrl,
      role,
      createdAt,
      isBanned,
      clerkId
    }`,
    { limit: limit - 1 }
  );
}
