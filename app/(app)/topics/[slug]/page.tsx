import PostCard from "@/components/post-card";
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      <p className="text-gray-700">
        {topic.description || "No description available for this topic."}
      </p>
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts slug={slug} />
      </Suspense>
    </div>
  );
};

const Posts = async ({ slug }: { slug: string }) => {
  const posts = await getPostsByTopic(slug);

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 mt-6 space-y-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="break-inside-avoid mb-4">
            <PostCard post={post} />
          </div>
        ))
      ) : (
        <div className="text-gray-500">No posts found for this topic.</div>
      )}
    </div>
  );
};

export default TopicPage;
