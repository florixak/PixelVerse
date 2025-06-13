import MasonryWrapper from "@/components/masonry-wrapper";
import PostCard from "@/components/post/post-card";
import { getTrendingContent } from "@/sanity/lib/featured/getTrendingContent";

const ExplorePage = async () => {
  const trendingPosts = await getTrendingContent();
  return (
    <section className="relative max-w-6xl mx-auto flex flex-col gap-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-muted-foreground">
          Discover trending posts and topics from the community.
        </p>
      </div>

      <MasonryWrapper className="mt-4">
        {trendingPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </MasonryWrapper>
    </section>
  );
};

export default ExplorePage;
