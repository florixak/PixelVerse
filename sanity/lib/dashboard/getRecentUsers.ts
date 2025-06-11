import { groq } from "next-sanity";
import { client } from "../client";

export async function getRecentUsers(limit = 5) {
  return client.fetch(
    groq`*[_type == "user"] | order(_createdAt desc) [0...$limit] {
      _id,
      username,
      fullName,
      email,
      imageUrl,
      role,
      createdAt,
      isBanned
    }`,
    { limit: limit - 1 }
  );
}
