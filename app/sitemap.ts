import type { MetadataRoute } from "next";
import getPostsForSitemap from "@/sanity/lib/sitemap/getPostsForSitemap";
import getUsersForSitemap from "@/sanity/lib/sitemap/getUsersForSitemap";
import getTopicsForSitemap from "@/sanity/lib/sitemap/getTopicsForSitemap";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, topics, users] = await Promise.all([
    getPostsForSitemap(),
    getTopicsForSitemap(),
    getUsersForSitemap(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/create-post`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/topics`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/topics/${post.topicSlug}/${post.slug}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const topicPages: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${BASE_URL}/topics/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const userPages: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${BASE_URL}/user/${user.username}`,
    lastModified: new Date(user.createdAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...topicPages, ...userPages];
}
