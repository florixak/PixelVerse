import Image from "next/image";

type StaticImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};
const StaticImage = ({
  src,
  alt = "",
  width,
  height,
  className = "",
  priority = false,
}: StaticImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      placeholder="blur"
      blurDataURL={src}
      priority={priority}
    />
  );
};

export default StaticImage;
