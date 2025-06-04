import { formatDate } from "@/lib/utils";
import { Post } from "@/sanity.types";
import { getCommentsByPostId } from "@/sanity/lib/posts/getCommentsByPostId";

type PostCommentProps = {
  postId: Post["_id"];
};

const PostComments = async ({ postId }: PostCommentProps) => {
  const comments = await getCommentsByPostId(postId, 10, 0);
  return (
    <div className="flex-center flex-col gap-2">
      <p className="text-muted-foreground">Comments</p>
      <div className="flex flex-col w-full max-w-2xl">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="mb-4 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                {comment.author?.username} on {formatDate(comment.publishedAt)}
              </p>
              <p className="mt-2">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostComments;
