import getPostsByTopic from "@/sanity/lib/posts/getPostsByTopic";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import React, { Suspense } from "react";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

const TopicPage = async ({ params }: TopicPageProps) => {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic || !topic.slug) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-gray-700">
          The topic <strong>{slug}</strong> does not exist.
        </p>
      </div>
    );
  }
  const posts = await getPostsByTopic(slug);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Topic: {topic.title}</h1>
      <p className="text-gray-700">
        This is the page for the topic: <strong>{slug}</strong>. Here you can
        find posts related to this topic.
      </p>
      <Suspense fallback={<div>Loading posts...</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.slug}
                className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  Created on: {new Date(post._createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Last modified:{" "}
                  {new Date(post._updatedAt).toLocaleDateString()}
                </p>
                <a
                  href={`/topics/${topic.slug}/${post.slug}`}
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
      </Suspense>
    </div>
  );
};

export default TopicPage;
