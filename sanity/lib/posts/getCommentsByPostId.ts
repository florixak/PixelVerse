import { Comment } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

type GetCommentsByPostIdParams = {
  postId: string;
  page?: number;
  limit?: number;
};

export const getCommentsByPostId = async ({
  postId,
  limit = 10,
  page = 0,
}: GetCommentsByPostIdParams): Promise<Comment[]> => {
  return client.fetch<Comment[]>(
    groq`*[_type == "comment" && references($postId) && author->isBanned != true && isDeleted != true && isBanned != true]  {
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
    } | order(publishedAt desc)[${page * limit}..${(page + 1) * limit - 1}]`,
    { postId, limit }
  );
};
