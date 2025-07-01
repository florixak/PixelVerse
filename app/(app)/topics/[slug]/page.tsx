import InfiniteTopicPosts from "@/components/post/infinite-topic-posts";
import TopicHeader from "@/components/topic/topic-header";
import { getQueryClient } from "@/lib/get-query-client";
import { SortOrder } from "@/lib/types";
import { Topic } from "@/sanity.types";
import getPostsByTopic from "@/sanity/lib/posts/getPostsByTopic";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: SortOrder }>;
};

const LIMIT = 12;

const TopicPage = async ({ params, searchParams }: TopicPageProps) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const { sort } = await searchParams;

  const topic = await getTopicBySlug(decodeURIComponent(slug));
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

    console.log(`✅ Prefetched posts for topic: ${topic.slug}, sort: ${sort}`);
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
