import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";
import getTopicBySlug from "../topics/getTopicBySlug";

export async function getTrendingTopics(limit = 5) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoISOString = weekAgo.toISOString();

  const recentPosts = await client.fetch<Post[]>(
    groq`*[_type == "post" && publishedAt > $weekAgo] {
      "topicId": topic->_id,
      "name": topic->name,
      "slug": topic->slug.current,
      "imageUrl": topic->imageUrl
    }`,
    { weekAgo: weekAgoISOString }
  );

  // Process the data in JavaScript instead of using GROQ group
  const topicMap = new Map();

  // Count posts per topic
  for (const post of recentPosts) {
    // Use the data directly from the GROQ query
    const topic = await getTopicBySlug(post.topicSlug || "");
    if (!topic) continue;
    const topicId = topic?._id;
    if (!topicMap.has(topicId)) {
      topicMap.set(topicId, {
        _id: topicId,
        name: post.title,
        slug: post.slug,
        imageUrl: post.imageUrl,
        count: 1,
      });
    } else {
      // Increment the count for existing topics
      const topic = topicMap.get(topicId);
      topic.count += 1;
      topicMap.set(topicId, topic);
    }
  }

  // Convert to array, sort by count, and limit to requested number
  const trendingTopics = Array.from(topicMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((topic) => ({
      ...topic,
      trend: "up",
    }));

  console.log("Trending Topics:", trendingTopics);

  return trendingTopics;
}
