// app/(app)/page.tsx
import getFeaturedContent from "@/sanity/lib/featured/getFeaturedContent";
import TopicsCarousel from "@/components/topics-carousel";
import FeaturedPosts from "@/components/featured-posts";

export default async function Home() {
  const { featuredPosts, popularTopics } = await getFeaturedContent();

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to PixelDit
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Popular Topics</h2>
        <TopicsCarousel topics={popularTopics} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Pixel Art</h2>
        <FeaturedPosts posts={featuredPosts} />
      </section>
    </div>
  );
}
