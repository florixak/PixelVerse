import FeaturedPosts from "@/components/post/featured-posts";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import PopularTopics from "@/components/topic/popular-topics";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="relative w-full h-screen flex-center">
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          <InteractiveGridPattern
            className={cn(
              "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] w-full h-full opacity-20"
            )}
            width={60}
            height={60}
          />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 mb-24">
          <h1 className="font-pixel text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Welcome to <span className="text-primary">Pixel</span>Verse
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Discover the world of pixel art, share your creations, and connect
            with fellow artists in our growing community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/topics">
                Explore Topics <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/create-post">
                Share Your Art <ImageIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            <Sparkles className="text-yellow-500 mr-2 h-6 w-6" />
            Popular Topics
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/topics">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="h-48 w-full bg-muted/50 animate-pulse rounded-lg"></div>
          }
        >
          <PopularTopics />
        </Suspense>
      </section>

      <section className="w-full bg-muted/30 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Pixel Art
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/posts">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-muted/50 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            }
          >
            <FeaturedPosts />
          </Suspense>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Join Our Community
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with thousands of pixel artists, get feedback on your work,
          and participate in weekly challenges.
        </p>
        <Button size="lg" asChild>
          <SignInButton />
        </Button>
      </section>
    </div>
  );
}
