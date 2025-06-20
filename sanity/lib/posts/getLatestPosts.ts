import getAllPosts from "./getAllPosts";

export async function getLatestPosts({ page = 0, limit = 8 }) {
  const posts = await getAllPosts({
    sort: "latest",
    limit,
    page,
  });
  return posts;
}
