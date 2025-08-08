import type { MetadataRoute } from "next";
import getPostsForSitemap, {
  getPostsForSitemapReturn,
} from "@/sanity/lib/sitemap/getPostsForSitemap";
import getUsersForSitemap, {
  getUsersForSitemapReturn,
} from "@/sanity/lib/sitemap/getUsersForSitemap";
import getTopicsForSitemap, {
  getTopicsForSitemapReturn,
} from "@/sanity/lib/sitemap/getTopicsForSitemap";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      url: `${BASE_URL}/topics`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date("2025-08-08"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2025-08-08"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let posts: getPostsForSitemapReturn = [];
  let topics: getTopicsForSitemapReturn = [];
  let users: getUsersForSitemapReturn = [];

  try {
    posts = await getPostsForSitemap();
  } catch (error) {
    console.error("Failed to fetch posts for sitemap:", error);
  }

  try {
    topics = await getTopicsForSitemap();
  } catch (error) {
    console.error("Failed to fetch topics for sitemap:", error);
  }

  try {
    users = await getUsersForSitemap();
  } catch (error) {
    console.error("Failed to fetch users for sitemap:", error);
  }

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
