import { groq } from "next-sanity";
import { client } from "../client";
import { Post, Topic } from "@/sanity.types";
import { SortOrder } from "@/lib/types";
import { getSanityOrderBy } from "@/lib/utils";

type GetPostsByTopicParams = {
  topicSlug: Topic["slug"];
  sort?: SortOrder;
  page?: number;
  limit?: number;
};

const getPostsByTopic = async ({
  topicSlug,
  sort,
  page = 0,
  limit = 50,
}: GetPostsByTopicParams): Promise<Post[]> => {
  let orderBy = "publishedAt desc";

  if (sort) {
    orderBy = getSanityOrderBy(sort);
  }

  return client.fetch(
    groq`*[_type == "post" && references(*[_type == "topic" && slug.current == $topicSlug]._id) && isDeleted != true] | order(${orderBy})[${
      page * limit
    }..${(page + 1) * limit - 1}] {
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
    { topicSlug, page, limit }
  );
};

export default getPostsByTopic;
