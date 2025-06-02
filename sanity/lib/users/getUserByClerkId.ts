import { groq } from "next-sanity";
import { client } from "../client";
import { User } from "@/sanity.types";

export const getUserByClerkId = async (
  clerkId: string
): Promise<User | null> => {
  return client.fetch(
    groq`*[_type == "user" && clerkId == $clerkId][0] {
      _id,
      _createdAt,
      username,
      fullName,
      email,
      clerkId,
      imageUrl,
      "favoriteTopics": favoriteTopics[]-> {
        _id,
        title,
        "slug": slug.current,
        description
      },
      "postCount": count(*[_type == "post" && references(^._id)]),
      "commentCount": count(*[_type == "comment" && references(^._id)]),
      "upvotedPosts": *[_type == "vote" && user._ref == ^._id && value > 0].post._ref,
      "downvotedPosts": *[_type == "vote" && user._ref == ^._id && value < 0].post._ref,
      isReported
    }`,
    { clerkId }
  );
};
