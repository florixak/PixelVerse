import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

const getPostsByTopic = async (topicSlug: string): Promise<Post[]> => {
  return client.fetch(
    groq`*[_type == "post" && references(*[_type == "topic" && slug.current == $topicSlug]._id) && isDeleted != true] | order(likes desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      "topicSlug": *[_type == "topic" && _id == ^.topic._ref][0].slug.current,
      dimensions,
      software,
      "likes": count(reactions[type == "like"]),
      "dislikes": count(reactions[type == "dislike"]),
      tags,
      isDeleted,
      "commentsCount": count(*[_type == "comment" && references(^._id)]),
    }`,
    { topicSlug }
  );
};

export default getPostsByTopic;
