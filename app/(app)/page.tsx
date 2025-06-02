import TopicsCarousel from "@/components/topics-carousel";
import FeaturedPosts from "@/components/featured-posts";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to PixelVerse
      </h1>

      <p>
        Discover the world of pixel art, share your creations, and connect with
        fellow artists. Explore popular topics and featured pixel art posts to
        get inspired and join the community!
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Popular Topics</h2>
        <Suspense fallback={<div>Loading popular topics...</div>}>
          <TopicsCarousel />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Pixel Art</h2>
        <Suspense fallback={<div>Loading featured posts...</div>}>
          <FeaturedPosts />
        </Suspense>
      </section>
    </div>
  );
}
