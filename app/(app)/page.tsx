import FeaturedPosts from "@/components/post/featured-posts";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import PopularTopics from "@/components/topic/popular-topics";
import { isReturningVisitor } from "@/lib/visitor-detection";
import HeroSection from "@/components/landing-page/hero-section";
import NewestPosts from "@/components/post/newest-posts";
import HomeContent from "@/components/home-content";

export default async function Home() {
  const returning = await isReturningVisitor();

  return (
    <div className="flex flex-col items-center w-full">
      {!returning && <HeroSection />}
      <Suspense
        fallback={
          <div className="h-96 w-full bg-muted/50 animate-pulse rounded-lg"></div>
        }
      >
        <HomeContent />
      </Suspense>
    </div>
  );
}
