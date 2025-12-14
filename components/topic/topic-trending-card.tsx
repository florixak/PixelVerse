import { Topic } from "@/sanity.types";
import BasicCard from "../basic-card";
import Image from "next/image";
import Link from "next/link";

type TopicTrendingCardProps = {
  topic: Topic;
  className?: string;
};

const TopicTrendingCard = ({ topic, className }: TopicTrendingCardProps) => {
  return (
    <BasicCard
      className={`flex flex-row items-center p-2 w-[13rem] ${className}`}
    >
      <div className="flex items-center justify-center min-w-[80px] h-16 p-2">
        {topic.iconUrl && (
          <Image
            src={topic.iconUrl}
            alt={`Icon for ${topic.title}`}
            width={48}
            height={48}
            className="object-contain rounded-lg"
            loading="lazy"
            blurDataURL={topic.iconUrl}
          />
        )}
      </div>
      <div className="flex-1">
        <Link href={`/topics/${topic.slug}`}>
          <h2 className="text-xl font-bold mt-2">{topic.title}</h2>
        </Link>

        <p className="text-sm text-muted-foreground mt-2">
          {topic.postCount} posts
        </p>
      </div>
    </BasicCard>
  );
};

export default TopicTrendingCard;
