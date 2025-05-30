import { groq } from "next-sanity";
import { client } from "../client";

const getCommentWithReplies = (commentId: string) => {
  return client.fetch(
    groq`*[_type == "comment" && _id == $commentId][0] {
      _id,
      content,
      publishedAt,
      "author": author->{_id, username, "imageUrl": imageUrl},
      "post": post->{_id, title, "slug": slug.current},
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
    }`,
    { commentId }
  );
};

export default getCommentWithReplies;
