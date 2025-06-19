import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import InfinitePosts from "./infinite-posts";
import { getLatestPosts } from "@/actions/postActions";

export const LIMIT = 8;

const NewestPosts = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "latest"],
    queryFn: ({ pageParam = 0 }) =>
      getLatestPosts({ page: pageParam, limit: LIMIT }),
    initialPageParam: 0,
  });

  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Newest Posts</h2>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InfinitePosts />
      </HydrationBoundary>
    </section>
  );
};

export default NewestPosts;
