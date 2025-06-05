import { getFeaturedPosts } from "@/sanity/lib/featured/getFeaturedPosts";
import PostCard from "./post-card";

type FeaturedPostsProps = {
  className?: string;
  showTitle?: boolean;
  title?: string;
};

const FeaturedPosts = async ({ className = "" }: FeaturedPostsProps) => {
  const posts = await getFeaturedPosts();
  return (
    <div className={`featured-posts ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;
