import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

export const getFeaturedPosts = async (limit: number = 6): Promise<Post[]> => {
  if (limit <= 0) {
    return [];
  }

  return client.fetch<Post[]>(
    groq`
      *[_type == "post" && isDeleted != true && author->isBanned != true] {
        _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      "topicSlug": *[_type == "topic" && _id == ^.topic._ref][0].slug.current,
      dimensions,
      software,
      "likes": count(reactions[type == "like"]),
      "dislikes": count(reactions[type == "dislike"]),
      tags,
      isDeleted,
      "commentsCount": count(*[_type == "comment" && references(^._id) && isDeleted != true])
      } | order(likes asc)[0...${limit}]
    `
  );
};
