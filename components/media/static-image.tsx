import Image from "next/image";

type StaticImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  placeholderSrc?: string;
  blurDataURL?: string;
};
const StaticImage = ({
  src,
  alt = "",
  width,
  height,
  className = "",
  priority = false,
  placeholderSrc = "",
  blurDataURL = "",
}: StaticImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      placeholder={placeholderSrc ? "blur" : undefined}
      blurDataURL={blurDataURL || undefined}
      priority={priority}
    />
  );
};

export default StaticImage;
