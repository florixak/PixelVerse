"use client";

import MasonryWrapper from "../masonry-wrapper";
import PostCard from "./post-card";
import { Button } from "../ui/button";
import { LIMIT } from "./newest-posts";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import { usePrefetchPerformance } from "@/hooks/use-prefetch-performance";
import { Post, Topic } from "@/sanity.types";
import getPostsByTopic from "@/sanity/lib/posts/getPostsByTopic";
import { SortOrder } from "@/types/filter";

type InfiniteTopicPostsProps = {
  topic: Topic;
  sort?: SortOrder;
};

const InfiniteTopicPosts = ({
  topic,
  sort = "latest",
}: InfiniteTopicPostsProps) => {
  const topicSlug = topic.slug || "";
  const {
    data,
    isError,
    error,
    ref,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteScroll<Post[]>({
    queryKey: ["posts", "topic", topicSlug, sort],
    queryFn: ({ page = 0 }) =>
      getPostsByTopic({
        topicSlug: topicSlug,
        page: page,
        limit: LIMIT,
        sort,
      }),
    limit: LIMIT,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-center text-muted-foreground">
          🔄 Loading posts... (Not prefetched)
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  const wasPrefeched = data && !isLoading;

  usePrefetchPerformance({
    queryKey: ["posts", "topic", topicSlug, sort],
    wasDataPrefetched: !!wasPrefeched,
  });

  return (
    <>
      <MasonryWrapper>
        {data.map((post) => (
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

export default InfiniteTopicPosts;
