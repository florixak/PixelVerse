"use client";

import React from "react";
import MasonryWrapper from "../masonry-wrapper";
import PostCard from "../post/post-card";
import { useQuery } from "@tanstack/react-query";
import { getTrendingContent } from "@/sanity/lib/featured/getTrendingContent";
import ExploreLoadingSkeleton from "./explore-loading-skeleton";
import GlobalEmptyContentState from "../global-empty-content-state";

const TrendingPostsInner = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: () => getTrendingContent(),
  });

  if (isError) {
    return <GlobalEmptyContentState />;
  }

  if (isLoading) {
    return <ExploreLoadingSkeleton />;
  }

  return (
    <MasonryWrapper className="mt-4">
      {data?.posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </MasonryWrapper>
  );
};

export default TrendingPostsInner;
