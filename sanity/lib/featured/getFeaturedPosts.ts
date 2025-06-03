import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

export const getFeaturedPosts = async (): Promise<Post[]> => {
  return client.fetch(
    groq`
      *[_type == "post" && isDeleted != true] | order(upvotes desc)[0...6] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        postType,
        "imageUrl": image.asset->url,
        "author": author->{username, "imageUrl": imageUrl, clerkId},
        "topic": topic->{title, "slug": slug.current},
        "comments": *[_type == "comment" && references(^._id)]{
        _id,
        content,
        author->{_id, username, "imageUrl": imageUrl},
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
