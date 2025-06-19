import { cn } from "@/lib/utils";
import { ArrowRight, ImageIcon } from "lucide-react";
import React from "react";
import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex-center">
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] w-full h-full opacity-20 hidden sm:block"
          )}
          width={60}
          height={60}
        />
        <AnimatedGridPattern
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] w-full h-full opacity-20 sm:hidden"
          )}
          width={60}
          height={60}
          numSquares={20}
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
  );
};

export default HeroSection;
