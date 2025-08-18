import { Suspense } from "react";
import HeroSection from "@/components/landing-page/hero-section";
import HomeContent from "@/components/home-content";

export default async function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <HeroSection />
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
