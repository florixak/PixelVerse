import InfiniteTopicPosts from "@/components/post/infinite-topic-posts";
import TopicHeader from "@/components/topic/topic-header";
import { getQueryClient } from "@/lib/get-query-client";

import { Topic } from "@/sanity.types";
import getPostsByTopic from "@/sanity/lib/posts/getPostsByTopic";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import { SortOrder } from "@/types/filter";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache, Suspense } from "react";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: SortOrder }>;
};

const LIMIT = 12;

const getCachedTopicBySlug = cache(async (slug: string) => {
  return await getTopicBySlug(slug);
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const topic = await getCachedTopicBySlug(decodeURIComponent(slug));

    if (!topic) {
      return {
        title: "Topic Not Found",
        description: "The requested topic could not be found.",
      };
    }

    return {
      title: topic.title,
      description:
        topic.description ||
        `Explore ${topic.title} pixel art and related posts.`,
      openGraph: {
        title: `${topic.title} - PixelVerse`,
        description:
          topic.description || `Discover amazing ${topic.title} pixel art`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/topics/${topic.slug}`,
        images: topic.bannerUrl
          ? [
              {
                url: topic.bannerUrl,
                width: 800,
                height: 600,
                alt: topic.title,
              },
            ]
          : undefined,
      },
      twitter: {
        title: `${topic.title} - PixelVerse`,
        description:
          topic.description || `Explore ${topic.title} pixel art and posts.`,
        card: "summary_large_image",
        images: [topic.bannerUrl || ""],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Explore Topics",
      description: "Discover and explore various topics related to pixel art.",
    };
  }
};

const TopicPage = async ({ params, searchParams }: TopicPageProps) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const { sort } = await searchParams;

  const topic = await getCachedTopicBySlug(decodeURIComponent(slug));
  if (!topic || !topic.slug) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-3 px-4 md:px-6 py-6 w-full">
      <TopicHeader topic={topic} />

      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsList sort={sort} topic={topic} />
      </Suspense>
    </section>
  );
};

const PostsList = async ({
  sort = "latest",
  topic,
}: {
  sort?: SortOrder;
  topic: Topic;
}) => {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["posts", "topic", topic.slug, sort],
      queryFn: ({ pageParam = 0 }) =>
        getPostsByTopic({
          topicSlug: topic.slug || "",
          page: pageParam,
          limit: LIMIT,
          sort,
        }),
      initialPageParam: 0,
    });
  } catch (error) {
    console.error("❌ Failed to prefetch posts:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteTopicPosts topic={topic} sort={sort} />
    </HydrationBoundary>
  );
};

export default TopicPage;
