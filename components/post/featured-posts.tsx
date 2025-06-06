import { getFeaturedPosts } from "@/sanity/lib/featured/getFeaturedPosts";

import Posts from "./posts";

const FeaturedPosts = async () => {
  const posts = await getFeaturedPosts();
  return <Posts posts={posts} />;
};

export default FeaturedPosts;
