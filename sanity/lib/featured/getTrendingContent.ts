import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

type TrendingAlgorithmOptions = {
  // Time period to consider content as "recent" (in days)
  recencyPeriod?: number;
  // Score multipliers
  recencyWeight?: number;
  likesWeight?: number;
  commentsWeight?: number;
  // Randomization settings
  randomFactorMax?: number;
  maxOffset?: number;
};

export const getTrendingContent = async (
  limit: number = 6,
  options?: TrendingAlgorithmOptions
): Promise<Post[]> => {
  if (limit <= 0) {
    return [];
  }

  const {
    recencyPeriod = 7, // Last 7 days considered "recent"
    recencyWeight = 10, // Recent posts get 10x boost
    likesWeight = 2, // Each like is worth 2 points
    commentsWeight = 3, // Each comment is worth 3 points
    randomFactorMax = 5, // Random boost of 0-5 points
    maxOffset = 10, // Random start position in results (0-10)
  } = options || {};

  const offset = Math.floor(Math.random() * maxOffset);
  const randomFactor = Math.floor(Math.random() * randomFactorMax);

  return client.fetch<Post[]>(
    groq`*[_type == "post" && defined(slug.current) && publishedAt < now()] | order(
      ((dateTime(publishedAt) > dateTime(now()) - 60*60*24*${recencyPeriod}) * ${recencyWeight} +
      coalesce(likes, 0) * ${likesWeight} + 
      coalesce(count(*[_type == "comment" && references(^._id)]), 0) * ${commentsWeight} +
      ${randomFactor}) desc
    ) [${offset}...${offset + limit}] {
      _id,
      _type,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage,
      "imageUrl": image.asset->url,
      "likes": coalesce(likes, 0),
      "commentCount": count(*[_type == "comment" && references(^._id)]),
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      "topicSlug": topic->slug.current,
      "topic": topic->{
        _id,
        title,
        "slug": slug.current,
        color
      }
    }`
  );
};
