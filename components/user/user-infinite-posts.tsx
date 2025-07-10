"use client";

import { Post, User } from "@/sanity.types";
import MasonryWrapper from "../masonry-wrapper";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import getAllUserPosts from "@/sanity/lib/posts/getAllUserPosts";
import PostCard from "../post/post-card";
import { Button } from "../ui/button";

type UserInfinitePostsProps = {
  user: User;
};

const UserInfinitePosts = ({ user }: UserInfinitePostsProps) => {
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
    queryKey: ["posts", "user", user.clerkId!],
    queryFn: ({ page = 0 }) =>
      getAllUserPosts({
        clerkId: user.clerkId,
        page: page,
        limit: 3,
      }),
    limit: 3,
  });

  if (isError) {
    return (
      <div className="text-red-500 text-center">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center">Loading posts...</div>;
  }

  if (!data) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No user posts found.
      </div>
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

export default UserInfinitePosts;
