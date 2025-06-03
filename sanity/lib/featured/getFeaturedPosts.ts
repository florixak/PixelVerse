import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

export const getFeaturedPosts = async (): Promise<Post[]> => {
  return client.fetch<Post[]>(
    groq`
      *[_type == "post" && isDeleted != true] | order(upvotes desc)[0...6] {
        _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId},
      "topicSlug": *[_type == "topic" && _id == ^.topic._ref][0].slug.current,
      dimensions,
      software,
      "likes": count(reactions[type == "like"]),
      "dislikes": count(reactions[type == "dislike"]),
      tags,
      isDeleted,
      "comments": *[_type == "comment" && references(^._id)]{
        _id,
        content,
        author->{_id, username, "imageUrl": imageUrl, clerkId},
        publishedAt,
        parentComment,
        likes,
        dislikes,
        isEdited,
        lastEditedAt,
        pixelArtUrl,
        isDeleted
      }
      }
    `
  );
};
