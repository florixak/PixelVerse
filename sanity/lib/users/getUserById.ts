import { groq } from "next-sanity";
import { client } from "../client";

const getUserById = async (userId: string) => {
  return client.fetch(
    groq`*[_type == "user" && _id == $userId][0] {
      _id,
      username,
      "imageUrl": imageUrl,
      createdAt,
      "postCount": count(*[_type == "post" && author._ref == $userId]),
      "commentCount": count(*[_type == "comment" && author._ref == $userId])
    }`,
    { userId }
  );
};

export default getUserById;
