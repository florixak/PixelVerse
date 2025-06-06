import MasonryWrapper from "@/components/masonry-wrapper";
import TopicCard from "@/components/topic-card";
import TopicSearch from "@/components/topic/topic-search";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";
import { Star } from "lucide-react";
import React, { Suspense } from "react";

type TopicsPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

type TopicsProps = {
  order?: string;
};

const TopicsPage = async ({ searchParams }: TopicsPageProps) => {
  const { order } = await searchParams;

  return (
    <section className="flex-center flex-col w-full gap-3 p-6 md:p-10">
      <div className="flex flex-col items-center w-full gap-2 max-w-3xl">
        <h1 className="text-2xl font-bold">Explore Topics</h1>
        <p className="text-gray-700">
          Here you can explore various topics related to pixel art. Click on a
          topic to see related posts.
        </p>
      </div>
      <TopicSearch order={order} />

      <div className="flex items-start gap-2 flex-col">
        <h2 className="text-2xl font-semibold flex flex-row items-center gap-2">
          <Star color="yellow" /> Popular Topics
        </h2>
        <Suspense fallback={<div>Loading popular topics...</div>}>
          <PopularTopics />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<div>Loading topics...</div>}>
          <Topics order={order} />
        </Suspense>
      </div>
    </section>
  );
};

const Topics = async ({ order }: TopicsProps) => {
  const topics = await getAllTopics({
    limit: 10,
    order: order === "latest" ? "latest" : "alphabetical",
    from: 0,
  });
  return (
    <MasonryWrapper>
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} />
      ))}
    </MasonryWrapper>
  );
};

const PopularTopics = async () => {
  const topics = await getAllTopics({
    limit: 10,
    order: "popular",
    from: 0,
  });
  return (
    <MasonryWrapper>
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} />
      ))}
    </MasonryWrapper>
  );
};

export default TopicsPage;
