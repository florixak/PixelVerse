"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

type AnimatedImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  placeholderSrc?: string;
};

const AnimatedImage = ({
  src,
  alt = "",
  width,
  height,
  className = "",
  placeholderSrc,
}: AnimatedImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [gifSrc, setGifSrc] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setGifSrc((prev) => prev ?? `${src}?t=${Date.now()}`);
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.4, rootMargin: "100px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible && gifSrc ? (
        <img
          src={gifSrc}
          alt={alt}
          width={width}
          height={height}
          className="object-cover w-full h-full"
        />
      ) : (
        <Image
          src={placeholderSrc || "/avatar-default.svg"}
          alt={alt}
          width={width}
          height={height}
          placeholder="blur"
          blurDataURL={placeholderSrc || "//avatar-default.svg"}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
};

export default AnimatedImage;
