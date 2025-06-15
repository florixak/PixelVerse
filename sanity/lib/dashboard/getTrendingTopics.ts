import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

export const getTrendingTopics = async (
  limit: number = 5
): Promise<Topic[]> => {
  return client.fetch(groq`
    *[_type == "topic" && defined(slug.current)] {
      _id,
      title,
      description,
      "slug": slug.current,
      "iconUrl": icon.asset->url,
      "bannerUrl": banner.asset->url,
      "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true && author->isBanned != true]),
      "totalPosts": count(*[_type == "post" && references(^._id)]),
      "recentPosts": count(*[_type == "post" && references(^._id) && 
                    dateTime(publishedAt) > dateTime(now()) - 60*60*24*7]),
      "recentComments": count(*[_type == "comment" && post->topic._ref == ^._id && 
                       dateTime(createdAt) > dateTime(now()) - 60*60*24*7]),
      "trendScore": (
        (count(*[_type == "post" && references(^._id) && 
         dateTime(publishedAt) > dateTime(now()) - 60*60*24*7]) * 3 + 
         count(*[_type == "comment" && post->topic._ref == ^._id && 
         dateTime(createdAt) > dateTime(now()) - 60*60*24*7])) * 0.7 +
        (count(*[_type == "post" && references(^._id)]) * 0.5) * 0.3
      )
    } | order(trendScore desc) [0...${limit}]
  `);
};
