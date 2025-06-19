import { Comment } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

export const getCommentById = async (commentId: string): Promise<Comment> => {
  return client.fetch<Comment>(
    groq`*[_type == "comment" && _id == $commentId && author->isBanned != true && isDeleted != true][0] {
      _id,
      content,
      author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      post->{
        _id, 
        title, 
        "slug": slug.current,
        excerpt,
        postType,
        "author": author->{_id, username, "imageUrl": imageUrl},
        "topicSlug": topic->slug.current,
        "topic": topic->{_id, "slug": slug.current, title},
        publishedAt,
        "commentsCount": count(*[_type == "comment" && references(^._id)])
      },
      publishedAt,
      parentComment,
      likes,
      dislikes,
      isEdited,
      lastEditedAt,
      pixelArtUrl,
      isDeleted
    }`,
    { commentId }
  );
};
