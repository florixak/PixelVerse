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
      "favoriteTopics": favoriteTopics[]-> {
        _id,
        title,
        "slug": slug.current,
        description
      },
      "postCount": count(*[_type == "post" && references(^._id)]),
      "commentCount": count(*[_type == "comment" && references(^._id)]),
      "receivedLikes": count(*[_type == "post" && author._ref == ^._id]{
        "likes": reactions[type == "like"]
      }[].likes[]),
      isReported
    }`,
    { userId }
  );
};

export default getUserById;
