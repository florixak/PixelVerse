import { getPostsByTopic } from "@/data/dummyData";
import React from "react";

interface TopicPageProps {
  params: {
    slug: string;
  };
}

const TopicPage = async ({ params }: TopicPageProps) => {
  const { slug } = params;
  if (!slug) {
    return <div className="text-red-500">Topic not found</div>;
  }
  const posts = await getPostsByTopic(slug);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Topic: {slug}</h1>
      <p className="text-gray-700">
        This is the page for the topic: <strong>{slug}</strong>. Here you can
        find posts related to this topic.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.slug}
              className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">
                Created on: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Last modified:{" "}
                {new Date(post.lastModified).toLocaleDateString()}
              </p>
              <a
                href={`/topics/${slug}/${post.slug}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Post
              </a>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No posts found for this topic.</div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
