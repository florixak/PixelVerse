import { getPopularTopics } from "@/sanity/lib/featured/getPopularTopics";
import TopicCard from "./topic-card";
import MasonryWrapper from "../masonry-wrapper";

type PopularTopicsProps = {
  className?: string;
  showTitle?: boolean;
  title?: string;
};

const PopularTopics = async ({ className = "" }: PopularTopicsProps) => {
  const topics = await getPopularTopics();
  return (
    <MasonryWrapper>
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} />
      ))}
    </MasonryWrapper>
  );
};

export default PopularTopics;
