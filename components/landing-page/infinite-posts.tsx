"use client";

import { getLatestPosts } from "@/sanity/lib/posts/getLatestPosts";
import MasonryWrapper from "../masonry-wrapper";
import PostCard from "../post/post-card";
import { Button } from "../ui/button";
import { LIMIT } from "./newest-posts";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";

const InfinitePosts = () => {
  const {
    data,
    isError,
    error,
    ref,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteScroll({
    queryKey: ["posts", "latest"],
    queryFn: getLatestPosts,
    limit: LIMIT,
  });

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  return (
    <>
      <MasonryWrapper>
        {data?.pages?.flat().map((post) => (
          <PostCard
            key={post._id}
            post={post}
            className="break-inside-avoid mb-4"
          />
        ))}
      </MasonryWrapper>

      {isError && (
        <div className="text-red-500 text-center">
          Error occured while fetching posts.
        </div>
      )}

      <div ref={ref}>
        {hasNextPage ? (
          isFetchingNextPage ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full max-w-md"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More Posts"}
              </Button>
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground mt-4">
            No more posts to load
          </div>
        )}
      </div>
    </>
  );
};

export default InfinitePosts;
