import { groq } from "next-sanity";
import { client } from "../client";

const getCommentsByPost = (postId: string) => {
  return client.fetch(
    groq`*[_type == "comment" && post._ref == $postId && !parentComment] {
      _id,
      content,
      publishedAt,
      "author": author->{_id, username, "imageUrl": imageUrl},
      upvotes,
      downvotes,
      pixelArtUrl,
      isEdited,
      lastEditedAt,
      isDeleted,
      "replies": *[_type == "comment" && parentComment._ref == ^._id] {
        _id,
        content,
        publishedAt,
        "author": author->{_id, username, "imageUrl": imageUrl},
        upvotes,
        downvotes,
        pixelArtUrl,
        isEdited,
        lastEditedAt,
        isDeleted
      } | order(publishedAt asc)
    } | order(publishedAt desc)`,
    { postId }
  );
};

export default getCommentsByPost;
