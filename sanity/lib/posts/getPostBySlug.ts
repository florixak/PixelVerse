import { Post } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

const getPostBySlug = async (
  postSlug: string,
  clerkId?: string
): Promise<Post & { userReaction?: string }> => {
  const userReactionField = clerkId
    ? `"userReaction": reactions[user->clerkId == "${clerkId}"][0].type,`
    : "";

  const query = groq`*[_type == "post" && slug.current == $postSlug && isDeleted != true][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    postType,
    "imageUrl": image.asset->url,
    "author": author->{_id, username, "imageUrl": imageUrl, clerkId},
    "topicSlug": topic->slug.current,
    dimensions,
    software,
    "reactions": reactions[] {
      user->{_id, username, "imageUrl": imageUrl, clerkId},
      type
    },
    tags,
    isDeleted,
    ${userReactionField}
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
  }`;

  return client.fetch(query, { postSlug });
};

export default getPostBySlug;
