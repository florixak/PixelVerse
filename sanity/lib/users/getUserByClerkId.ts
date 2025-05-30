import { groq } from "next-sanity";
import { client } from "../client";

export const getUserByClerkId = async (clerkId: string) => {
  return client.fetch(groq`*[_type == "user" && clerkId == $clerkId][0]`, {
    clerkId,
  });
};
