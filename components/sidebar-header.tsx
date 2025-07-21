"use client";

import Link from "next/link";
import {
  SidebarHeader as SidebarHead,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

const SidebarHeader = () => {
  const { open, isMobile } = useSidebar();
  return (
    <SidebarHead className="flex items-center justify-center gap-2 p-4 overflow-hidden">
      <Link
        href="/"
        className={open || isMobile ? "flex items-center gap-2" : "scale-200"}
        aria-label="PixelVerse Home"
      >
        <Image
          src="/pixelverse-favicon.png"
          alt="PixelVerse Logo"
          width={56}
          height={56}
        />
        {(open || isMobile) && (
          <h1 className="text-4xl font-bold overflow-hidden font-pixel">
            <span className="text-primary">Pixel</span>Verse
          </h1>
        )}
      </Link>
    </SidebarHead>
  );
};

export default SidebarHeader;
