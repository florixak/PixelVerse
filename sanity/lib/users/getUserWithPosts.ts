import { groq } from "next-sanity";
import { client } from "../client";

const getUserWithPosts = async (userId: string) => {
  return client.fetch(
    groq`*[_type == "user" && _id == $userId][0] {
      _id,
      username,
      "imageUrl": imageUrl,
      createdAt,
      "posts": *[_type == "post" && author._ref == $userId] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        postType,
        "imageUrl": image.asset->url,
        "topic": topic->{_id, title, "slug": slug.current},
        upvotes,
        downvotes
      } | order(publishedAt desc)[0...10]
    }`,
    { userId }
  );
};

export default getUserWithPosts;
