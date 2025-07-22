import { groq } from "next-sanity";
import { client } from "../client";
import { Post, Topic } from "@/sanity.types";

export async function getUserMostActiveTopic(
  clerkId: string,
  options: {
    limit?: number;
  }
): Promise<Topic | null> {
  const { limit = 100 } = options;
  const posts = await client.fetch<Post[]>(
    groq`*[_type == "post" && author->clerkId == $clerkId && defined(topic) && isDeleted != true && isBanned != true] | order(_createdAt desc)[0...${limit}] {
      "topic": topic->{
        _id,
        name,
        title,
        "slug": slug.current,
      }
    }`,
    { clerkId }
  );

  if (!posts || posts.length === 0) return null;

  const topicCounts: Record<string, { count: number; topic: Topic }> = {};
  posts.forEach((post) => {
    if (!post.topic) return;
    if (!post.topic._id) return;
    const id = post.topic?._id;
    if (!topicCounts[id]) {
      topicCounts[id] = {
        count: 0,
        topic: post.topic,
      };
    }
    topicCounts[id].count++;
  });

  const mostActive = Object.values(topicCounts).reduce(
    (max, current) => (current.count > max.count ? current : max),
    { count: -1, topic: {} as Topic }
  );

  return mostActive.count >= 0 ? mostActive.topic : null;
}
