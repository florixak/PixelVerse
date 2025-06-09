import { groq } from "next-sanity";
import { client } from "../client";
import { User } from "@/sanity.types";

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  return client.fetch(
    groq`*[_type == "user" && username == $username && isBanned != true][0] {
      _id,
      createdAt,
      username,
      fullName,
      email,
      clerkId,
      imageUrl,
      isBanned,
      role,
      "favoriteTopics": favoriteTopics[]-> {
        _id,
        title,
        "slug": slug.current,
        description
      },
      "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true]),
      "commentCount": count(*[_type == "comment" && references(^._id) && isDeleted != true]),
      "receivedLikes": count(*[_type == "post" && author._ref == ^._id && isDeleted != true]{
        "likes": reactions[type == "like"]
      }[].likes[]),
      bio,
      isReported
    }`,
    { username }
  );
};
