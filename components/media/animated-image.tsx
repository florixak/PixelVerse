"use client";

import { useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

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
  const [isVisible, setIsVisible] = useState(false);

  const { ref } = useInView({
    threshold: 0.2,
    onChange: (inView) => {
      setIsVisible(inView);
    },
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <img
          src={src || placeholderSrc || "/avatar-default.svg"}
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
          blurDataURL={placeholderSrc || "/avatar-default.svg"}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
};

export default AnimatedImage;
