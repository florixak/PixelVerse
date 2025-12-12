import { getQueryClient } from "@/lib/get-query-client";
import { getTrendingContent } from "@/sanity/lib/featured/getTrendingContent";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TrendingPostsInner from "./trending-posts-inner";

const TrendingPosts = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["trendingPosts"],
    queryFn: () => getTrendingContent(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrendingPostsInner />
    </HydrationBoundary>
  );
};

export default TrendingPosts;
