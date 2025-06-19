"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import MasonryWrapper from "../masonry-wrapper";
import PostCard from "../post/post-card";
import { getLatestPosts } from "@/actions/postActions";
import { Button } from "../ui/button";
import { LIMIT } from "./newest-posts";

const InfinitePosts = () => {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "latest"],
    queryFn: async ({ pageParam = 0 }) =>
      await getLatestPosts({ page: pageParam, limit: LIMIT }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < LIMIT) return undefined;
      return allPages.length;
    },
  });

  const allPosts = data?.pages.flat().flat() || [];
  const uniquePosts = Array.from(
    new Map(allPosts.map((post) => [post._id, post])).values()
  );

  return (
    <>
      <MasonryWrapper>
        {uniquePosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            className="break-inside-avoid mb-4"
          />
        ))}
      </MasonryWrapper>
      {isFetchingNextPage && <div className="text-center">Loading...</div>}
      {isError && (
        <div className="text-red-500 text-center">
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      )}
      {hasNextPage ? (
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full max-w-md"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More Posts"}
          </Button>
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-4">
          No more posts to load
        </div>
      )}
    </>
  );
};

export default InfinitePosts;
