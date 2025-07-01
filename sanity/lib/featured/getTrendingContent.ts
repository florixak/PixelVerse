import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

type TrendingAlgorithmOptions = {
  recencyPeriod?: number;
  recencyWeight?: number;
  likesWeight?: number;
  dislikesWeight?: number;
  commentsWeight?: number;
  likeDislikeRatio?: boolean;
  randomFactorMax?: number;
  maxOffset?: number;
};

export const getTrendingContent = async (
  limit: number = 6,
  options?: TrendingAlgorithmOptions
): Promise<{ posts: Post[] }> => {
  if (limit <= 0) {
    return { posts: [] };
  }

  const {
    recencyPeriod = 7, // Last 7 days considered "recent"
    recencyWeight = 10, // Recent posts get 10x boost
    likesWeight = 3, // Each like is worth 3 points
    dislikesWeight = -1, // Each dislike removes 1 point
    commentsWeight = 2, // Each comment is worth 2 points (only when enabled)
    likeDislikeRatio = true, // Consider engagement quality
    randomFactorMax = 5, // Random boost of 0-5 points
    maxOffset = 10, // Random start position in results (0-10)
  } = options || {};

  const offset = Math.floor(Math.random() * maxOffset);
  const randomFactor = Math.floor(Math.random() * randomFactorMax);

  return client.fetch<{ posts: Post[] }>(
    groq`{"posts": *[_type == "post" && defined(slug.current) && publishedAt < now() && isDeleted != true] | order(
      (
        // Recency boost for recent posts
        (dateTime(publishedAt) > dateTime(now()) - 60*60*24*${recencyPeriod}) * ${recencyWeight} +
        
        // Likes score
        coalesce(count(*[_type == "reaction" && references(^._id) && type == "like"]), 0) * ${likesWeight} + 
        
        // Dislikes penalty
        coalesce(count(*[_type == "reaction" && references(^._id) && type == "dislike"]), 0) * ${dislikesWeight} +
        
        // Comments score (only when comments are enabled)
        select(
          disabledComments == true => 0,
          coalesce(count(*[_type == "comment" && references(^._id)]), 0) * ${commentsWeight}
        ) +
        
        // Engagement quality bonus (like ratio)
        ${
          likeDislikeRatio
            ? `select(
          (coalesce(count(*[_type == "reaction" && references(^._id) && type == "like"]), 0) + 
           coalesce(count(*[_type == "reaction" && references(^._id) && type == "dislike"]), 0)) > 5 => 
          (coalesce(count(*[_type == "reaction" && references(^._id) && type == "like"]), 0) / 
           (coalesce(count(*[_type == "reaction" && references(^._id) && type == "like"]), 0) + 
            coalesce(count(*[_type == "reaction" && references(^._id) && type == "dislike"]), 0) + 1)) * 5,
          0
        )`
            : "0"
        } +
        
        // Random factor for variety
        ${randomFactor}
      ) desc
    ) [${offset}...${offset + limit}] {
      _id,
      _type,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage,
      "imageUrl": image.asset->url,
      "likes": count(*[_type == "reaction" && references(^._id) && type == "like"]),
      "dislikes": count(*[_type == "reaction" && references(^._id) && type == "dislike"]),
      "commentCount": count(*[_type == "comment" && references(^._id)]),
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      "topicSlug": topic->slug.current,
      disabledComments,
      "topic": topic->{
        _id,
        title,
        "slug": slug.current,
        color
      }
  }}`
  );
};
