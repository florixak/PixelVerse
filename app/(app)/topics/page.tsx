import MasonryWrapper from "@/components/masonry-wrapper";
import TopicTrendingCard from "@/components/topic/topic-trending-card";
import { SortOrder } from "@/types/filter";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";
import { Info, Sparkles, TrendingUp } from "lucide-react";
import React, { Suspense } from "react";
import TopicCard from "@/components/topic/topic-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TopicsSkeleton from "@/components/topic/topic-list-skeleton";
import TrendingTopicsSkeleton from "@/components/topic/topic-trending-card-skeleton";
import PopularTopicsSkeleton from "@/components/topic/popular-topics-skeleton";
import TopicSuggestButton from "@/components/topic/topic-suggest-button";
import SortFilterSelect from "@/components/sort-filter-select";
import NoContent from "@/components/no-content";
import GlobalEmptyContentState from "@/components/global-empty-content-state";

type TopicsPageProps = {
  searchParams: Promise<{
    sort?: SortOrder;
  }>;
};

type TopicsProps = {
  sort?: SortOrder;
};

export const generateMetadata = () => {
  return {
    title: "Explore Topics",
    description:
      "Discover and explore various topics related to pixel art. Click on a topic to see related posts.",
    openGraph: {
      title: "Explore Topics",
      description:
        "Discover and explore various topics related to pixel art. Click on a topic to see related posts.",
      url: "/topics",
    },
    twitter: {
      title: "Explore Topics",
      description:
        "Discover and explore various topics related to pixel art. Click on a topic to see related posts.",
    },
  };
};

const TopicsPage = async ({ searchParams }: TopicsPageProps) => {
  const { sort } = await searchParams;

  const allTopicsCount = await getAllTopics({ limit: 1, from: 0 });
  const hasAnyTopics = allTopicsCount && allTopicsCount.length > 0;

  if (!hasAnyTopics) {
    return (
      <section className="flex-center flex-col w-full gap-10 p-6 md:p-10">
        <div className="flex flex-col items-center w-full gap-2 max-w-3xl">
          <h1 className="text-2xl font-bold">Explore Topics</h1>
          <p className="text-muted-foreground">
            Here you can explore various topics related to pixel art.
          </p>
        </div>

        <GlobalEmptyContentState />
      </section>
    );
  }

  return (
    <section className="flex-center flex-col w-full gap-10 p-6 md:p-10">
      <div className="flex flex-col items-center w-full gap-2 max-w-3xl">
        <h1 className="text-2xl font-bold">Explore Topics</h1>
        <p className="text-muted-foreground">
          Here you can explore various topics related to pixel art. Click on a
          topic to see related posts.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>You can not find a topic?</span>
          <TopicSuggestButton />
        </div>
      </div>

      <div className="w-full flex items-start gap-10 flex-col">
        <div className="w-full flex items-start gap-2 flex-col">
          <h2 className="text-2xl font-semibold flex flex-row items-center gap-2">
            <Sparkles className="text-yellow-500" /> Popular Topics{" "}
            <Tooltip>
              <TooltipTrigger>
                <Info className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Topics that have gained the most traction in the last 7 days.
                </p>
              </TooltipContent>
            </Tooltip>
          </h2>
          <Suspense fallback={<PopularTopicsSkeleton />}>
            <PopularTopics />
          </Suspense>
        </div>
        <div className="flex items-start gap-2 flex-col w-full">
          <h2 className="text-2xl font-semibold flex flex-row items-center gap-2">
            <TrendingUp color="lime" /> Trending Topics
          </h2>
          <Suspense fallback={<TrendingTopicsSkeleton />}>
            <TrendingTopics />
          </Suspense>
        </div>
        <div className="flex items-start gap-2 flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-semibold flex flex-row items-center gap-2">
              All Topics
            </h2>
            <SortFilterSelect />
          </div>

          <Suspense fallback={<TopicsSkeleton />}>
            <Topics sort={sort} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

const Topics = async ({ sort }: TopicsProps) => {
  const topics = await getAllTopics({
    limit: 10,
    sort,
    from: 0,
  });

  if (!topics || topics.length === 0) {
    return (
      <NoContent message="There are no topics available." contentType="topic" />
    );
  }

  return (
    <MasonryWrapper>
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} />
      ))}
    </MasonryWrapper>
  );
};

const TrendingTopics = async () => {
  const topics = await getAllTopics({
    limit: 5,
    sort: "trending",
    from: 0,
  });
  if (!topics || topics.length === 0) {
    return (
      <NoContent message="No trending topics found." contentType="topic" />
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {topics.map((topic) => (
        <TopicTrendingCard key={topic._id} topic={topic} />
      ))}
    </div>
  );
};

const PopularTopics = async () => {
  const topics = await getAllTopics({
    limit: 10,
    sort: "popular",
    from: 0,
  });
  if (!topics || topics.length === 0) {
    return <NoContent message="No popular topics found." contentType="topic" />;
  }
  return (
    <MasonryWrapper>
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} />
      ))}
    </MasonryWrapper>
  );
};

export default TopicsPage;
