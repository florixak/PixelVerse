import { Post } from "@/sanity.types";
import { getCommentsByPostId } from "@/sanity/lib/posts/getCommentsByPostId";
import PostComment from "./post-comment";
import PostCommentForm from "./post-comment-form";
import PostCommentsWrapper from "./post-comments-wrapper";
import { currentUser } from "@clerk/nextjs/server";

type PostCommentProps = {
  post: Post;
};

const PostComments = async ({ post }: PostCommentProps) => {
  const comments = await getCommentsByPostId(post._id, 5, 0);
  const user = await currentUser();
  return (
    <div className="flex-center flex-col gap-2 border border-muted rounded-lg p-4 bg-background">
      <p className="text-muted-foreground">Comments</p>
      <PostCommentForm post={post} />
      <PostCommentsWrapper>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <PostComment
              key={comment._id}
              comment={comment}
              currentUserId={user?.id}
            />
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </PostCommentsWrapper>
    </div>
  );
};

export default PostComments;
