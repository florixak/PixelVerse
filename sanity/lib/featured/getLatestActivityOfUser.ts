import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

const getLatestActivityOfUser = async (
  clerkId: string,
  limit: number = 10
): Promise<Post[]> => {
  return client.fetch(
    groq`*[_type == "post" && author->clerkId == $clerkId && isDeleted != true] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      _createdAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role},
      "topicSlug": *[_type == "topic" && _id == ^.topic._ref][0].slug.current,
      likes,
      dislikes,
      "commentsCount": count(*[_type == "comment" && references(^._id)]),
      tags
    } | order(_createdAt desc)[0...$limit]`,
    { clerkId, limit }
  );
};

export default getLatestActivityOfUser;
