import TopicCard from "@/components/topic-card";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All the topics of PixelDit</h1>
      <p className="text-gray-700">
        Here you can explore various topics related to pixel art. Click on a
        topic to see related posts.
      </p>
      <Suspense fallback={<div>Loading topics...</div>}>
        <Topics order={order} />
      </Suspense>
    </div>
  );
};

const Topics = async ({ order }: TopicsProps) => {
  const topics = await getAllTopics({
    limit: 10,
    order: order === "latest" ? "latest" : "alphabetical",
    from: 0,
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} />
      ))}
    </div>
  );
};

export default TopicsPage;
