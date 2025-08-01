import { groq } from "next-sanity";
import { client } from "../client";
import { User } from "@/sanity.types";

const getUserById = async (userId: string): Promise<User> => {
  return client.fetch(
    groq`*[_type == "user" && _id == $userId && isBanned != true][0] {
      _id,
      _createdAt,
      username,
      fullName,
      email,
      clerkId,
      imageUrl,
      role,
      bio,
      "favoriteTopics": favoriteTopics[]-> {
        _id,
        title,
        "slug": slug.current,
        description
      },
      "postCount": count(*[_type == "post" && references(^._id)]),
      "commentCount": count(*[_type == "comment" && references(^._id)]),
      "followerCount": count(*[_type == "follow" && following._ref == ^._id]),
      "followingCount": count(*[_type == "follow" && follower._ref == ^._id]),
      "createdAt": _createdAt,
      isReported
    }`,
    { userId }
  );
};

export default getUserById;
