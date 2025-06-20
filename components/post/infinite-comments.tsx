"use client";

import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import { Post } from "@/sanity.types";
import { getCommentsByPostId } from "@/sanity/lib/posts/getCommentsByPostId";
import PostComment from "./post-comment";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { COMMENTS_LIMIT } from "./post-comments";

type InfiniteCommentsProps = {
  postId: Post["_id"];
};

const InfiniteComments = ({ postId }: InfiniteCommentsProps) => {
  const {
    data,
    isError,
    error,
    ref,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteScroll({
    queryKey: ["comments", postId],
    queryFn: async ({ page }) =>
      await getCommentsByPostId({ postId, limit: COMMENTS_LIMIT, page }),
    limit: COMMENTS_LIMIT,
  });

  const { user } = useUser();

  return (
    <div className="w-full">
      {isError && (
        <div className="text-red-500 text-center">
          Error:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {data?.pages?.flat().map((comment) => (
          <PostComment
            key={comment._id}
            comment={comment}
            currentUserId={user?.id}
          />
        ))}
      </div>

      <div className="mt-4">
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
          <div className="text-center text-muted-foreground">
            No more comments
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteComments;
