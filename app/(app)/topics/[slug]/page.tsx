import Posts from "@/components/post/posts";
import getPostsByTopic from "@/sanity/lib/posts/getPostsByTopic";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

const TopicPage = async ({ params }: TopicPageProps) => {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic || !topic.slug) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-3 px-0 py-6 md:p-6">
      <div className="flex flex-col items-start gap-4">
        {topic.bannerUrl && (
          <Image
            src={topic.bannerUrl}
            alt={`Banner for ${topic.title}`}
            width={1200}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
            priority
          />
        )}
        <div>
          <h1 className="text-4xl font-bold">{topic.title}</h1>
          <p className="text-gray-700">
            {topic.description || "No description available for this topic."}
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsList slug={slug} />
      </Suspense>
    </section>
  );
};

const PostsList = async ({ slug }: { slug: string }) => {
  const posts = await getPostsByTopic(slug);

  return <Posts posts={posts} />;
};

export default TopicPage;
