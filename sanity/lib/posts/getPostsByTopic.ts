import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";
import { SortOrder } from "@/lib/types";
import { getSanityOrderBy } from "@/lib/utils";

const getPostsByTopic = async (
  topicSlug: string,
  sort?: SortOrder
): Promise<Post[]> => {
  let orderBy = "publishedAt desc";

  if (sort) {
    orderBy = getSanityOrderBy(sort);
  }

  return client.fetch(
    groq`*[_type == "post" && references(*[_type == "topic" && slug.current == $topicSlug]._id) && isDeleted != true] | order(${orderBy})[0..49] {
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
      content,
      "commentsCount": count(*[_type == "comment" && references(^._id)])
    }`,
    { topicSlug }
  );
};

export default getPostsByTopic;
