import AnimatedImage from "./animated-image";
import StaticImage from "./static-image";

type SmartImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  placeholderSrc?: string;
};

const SmartImage = (props: SmartImageProps) => {
  const isGif = props.src.toLowerCase().endsWith(".gif");

  if (isGif) {
    return <AnimatedImage {...props} />;
  }

  return <StaticImage {...props} />;
};

export default SmartImage;
