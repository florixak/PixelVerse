import { getTopics } from "@/data/dummyData";
import React from "react";

const TopicsPage = async ({
  searchParams,
}: Readonly<{
  searchParams?: { [key: string]: string | string[] | undefined };
}>) => {
  const topics = await getTopics();
  if (!topics || topics.length === 0) {
    return <div className="text-red-500">No topics found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All the topics of PixelDit</h1>
      <p className="text-gray-700">
        Here you can explore various topics related to pixel art. Click on a
        topic to see related posts.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.slug}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <p className="text-sm text-gray-500">
              Created on: {new Date(topic.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Last modified: {new Date(topic.lastModified).toLocaleDateString()}
            </p>
            <a
              href={`/topics/${topic.slug}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Topic
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsPage;
