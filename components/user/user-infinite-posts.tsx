"use client";

import { Post, User } from "@/sanity.types";
import MasonryWrapper from "../masonry-wrapper";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import getAllUserPosts from "@/sanity/lib/posts/getAllUserPosts";
import PostCard from "../post/post-card";
import { Button } from "../ui/button";
import { SortOrder } from "@/types/filter";

type UserInfinitePostsProps = {
  user: User;
  sort?: SortOrder;
};

const UserInfinitePosts = ({
  user,
  sort = "latest",
}: UserInfinitePostsProps) => {
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
    queryKey: ["posts", "user", user.clerkId!, sort],
    queryFn: ({ page = 0 }) =>
      getAllUserPosts({
        clerkId: user.clerkId,
        page: page,
        limit: 3,
        sort,
      }),
    limit: 3,
  });

  if (isError) {
    return (
      <p className="text-red-500 text-center">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-center">Loading posts...</p>;
  }

  if (!data) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No user posts found.
      </p>
    );
  }

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
        <p className="text-red-500 text-center">
          Error occurred while fetching posts.
        </p>
      )}

      <div ref={ref}>
        {hasNextPage ? (
          isFetchingNextPage ? (
            <p className="text-center">Loading...</p>
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
          <p className="text-center text-muted-foreground mt-4">
            No more posts to load
          </p>
        )}
      </div>
    </>
  );
};

export default UserInfinitePosts;
