// sanity/lib/posts/getCommentsByPostId.ts
import { Comment } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

export const getCommentsByPostId = async (
  postId: string,
  limit: number = 10,
  offset: number = 0
): Promise<Comment[]> => {
  return client.fetch<Comment[]>(
    groq`*[_type == "comment" && references($postId) && author->isBanned != true && isDeleted != true] | order(publishedAt desc) [$offset...$offset+$limit] {
      _id,
      content,
      author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      publishedAt,
      parentComment,
      likes,
      dislikes,
      isEdited,
      lastEditedAt,
      pixelArtUrl,
      isDeleted
    }`,
    { postId, limit, offset }
  );
};
