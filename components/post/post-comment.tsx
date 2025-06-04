import { formatDate } from "@/lib/utils";
import { Comment, User } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { OptimisticComment } from "./post-comment-form";

type PostCommentProps = {
  comment: Comment | OptimisticComment;
  currentUserId?: User["clerkId"];
};

const PostComment = async ({ comment, currentUserId }: PostCommentProps) => {
  return (
    <div className="relative flex items-center gap-2 w-full py-2 px-4 border border-muted rounded-lg bg-background">
      <div className="absolute left-0 top-0 h-full w-px bg-muted">
        {comment.author?.clerkId === currentUserId ? (
          <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
        ) : (
          <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-muted rounded-full" />
        )}
      </div>
      <Link href={`/profile/${comment.author?.clerkId || "unknown"}`}>
        <Image
          src={comment.author?.imageUrl || "/avatar-default.svg"}
          alt={`${comment.author?.username || "Unknown User"}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
          width={32}
          height={32}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/avatar-default.svg"
        />
      </Link>
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">
          <Link
            href={`/profile/${comment.author?.clerkId || "unknown"}`}
            className="hover:text-primary hover:underline"
          >
            {comment.author?.username}
          </Link>{" "}
          on {formatDate(comment.publishedAt)}
        </p>
        <p className="mt-1">{comment.content}</p>
      </div>
    </div>
  );
};

export default PostComment;
