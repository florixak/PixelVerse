import { Suspense } from "react";
import { isReturningVisitor } from "@/lib/visitor-detection";
import HeroSection from "@/components/landing-page/hero-section";
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
