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

  const query = groq`*[_type == "post" && slug.current == $postSlug && isDeleted != true && author->isBanned != true][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    postType,
    "imageUrl": image.asset->url,
    "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
    "topicSlug": topic->slug.current,
    dimensions,
    "likes": count(reactions[type == "like"]),
    "dislikes": count(reactions[type == "dislike"]),
    software,
    difficulty,
    timeSpent,
    "colorPalette": colorPalette[] {
      hex,
      name,
      _key
    },
    "tutorialSteps": tutorialSteps[] {
      title,
      description,
      imageUrl,
      _key
    },
    "inspirationSource": inspirationSource,
    disabledComments,
    "reactions": reactions[] {
      user->{_id, username, "imageUrl": imageUrl, clerkId},
      type
      },
      "commentsCount": count(*[_type == "comment" && references(^._id)]),
      tags,
      isDeleted,
      content,
    ${userReactionField}
  }`;

  return client.fetch(query, { postSlug });
};

export default getPostBySlug;
