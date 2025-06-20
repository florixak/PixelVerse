import { LIMIT } from "@/components/landing-page/newest-posts";
import getAllPosts from "./getAllPosts";

export async function getLatestPosts({ page = 0, limit = LIMIT }) {
  const posts = await getAllPosts({
    sort: "latest",
    limit,
    page,
  });
  return posts;
}
