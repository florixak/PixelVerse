import { Button } from "@/components/ui/button";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";
import Link from "next/link";

import React, { Suspense } from "react";

type TopicsProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

const TopicsPage = async ({ searchParams }: TopicsProps) => {
  const { order } = await searchParams;

  const topics = await getAllTopics({
    limit: 10,
    order: order === "latest" ? "latest" : "alphabetical",
    from: 0,
  });
  console.log(topics);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All the topics of PixelDit</h1>
      <p className="text-gray-700">
        Here you can explore various topics related to pixel art. Click on a
        topic to see related posts.
      </p>
      <Suspense fallback={<div>Loading topics...</div>}>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="border rounded-lg p-4 w-[20rem] overflow-hidden"
            >
              {topic.bannerUrl && (
                <img
                  src={topic.bannerUrl}
                  alt={topic.title}
                  className="w-full object-cover rounded-lg"
                />
              )}
              <h2 className="text-xl font-bold mt-2">{topic.title}</h2>
              <p className="text-sm text-gray-600">{topic.description}</p>
              <Button asChild>
                <Link href={`/topics/${topic.slug}`}>View Topic</Link>
              </Button>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default TopicsPage;
