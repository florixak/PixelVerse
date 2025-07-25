import React from "react";
import PostComment from "./post-comment";
import { OptimisticComment } from "./post-comment-form";
import { useUser } from "@clerk/nextjs";
import { Post } from "@/sanity.types";

type PostOptimisticCommentsProps = {
  optimisticComments: OptimisticComment[];
  user: ReturnType<typeof useUser>["user"];
  post: Post;
};

const PostOptimisticComments = ({
  optimisticComments,
  user,
  post,
}: PostOptimisticCommentsProps) => {
  return (
    <div className="flex flex-col gap-2">
      {optimisticComments.map((comment) => (
        <PostComment
          key={comment._id}
          currentUserId={user?.id}
          comment={{
            ...comment,
            author: {
              username: user?.username || "Anonymous",
              imageUrl: user?.imageUrl || "/avatar-default.svg",
              clerkId: user?.id,
            },
          }}
        />
      ))}

      {optimisticComments.length === 0 && post.commentsCount === 0 && (
        <p className="text-muted-foreground text-sm text-center mt-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default PostOptimisticComments;
