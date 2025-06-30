import { Post } from "@/sanity.types";
import { getCommentsByPostId } from "@/sanity/lib/posts/getCommentsByPostId";
import PostCommentForm from "./post-comment-form";
import InfiniteComments from "./infinite-comments";
import { getQueryClient } from "@/lib/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

type PostCommentProps = {
  post: Post;
};

export const COMMENTS_LIMIT = 5;

const PostComments = async ({ post }: PostCommentProps) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["comments", post._id],
    queryFn: async ({ pageParam = 0 }) =>
      await getCommentsByPostId({
        postId: post._id,
        limit: COMMENTS_LIMIT,
        page: pageParam,
      }),
    initialPageParam: 0,
  });

  return (
    <div
      id="comments"
      className="flex-center flex-col gap-2 border border-muted rounded-lg p-4 bg-background"
    >
      <p className="text-muted-foreground">Comments ({post.commentsCount})</p>
      <PostCommentForm post={post} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InfiniteComments postId={post._id} />
      </HydrationBoundary>
    </div>
  );
};

export default PostComments;
