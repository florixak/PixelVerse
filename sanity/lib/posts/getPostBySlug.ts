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
    "commentsCount": count(*[_type == "comment" && references(^._id)]),
    tags,
    isDeleted,
    ${userReactionField}
  }`;

  return client.fetch(query, { postSlug });
};

export default getPostBySlug;
