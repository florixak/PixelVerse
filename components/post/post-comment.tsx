import { formatDate } from "@/lib/utils";
import { Comment, User } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { OptimisticComment } from "./post-comment-form";
import ReportButton from "../report-button";

type PostCommentProps = {
  comment: Comment | OptimisticComment;
  currentUserId?: User["clerkId"];
};

const PostComment = ({ comment, currentUserId }: PostCommentProps) => {
  const isAuthor = comment.author?.clerkId === currentUserId;
  return (
    <div
      id={`comment-${comment._id}`}
      className="flex flex-col gap-2 mb-4 justify-end"
    >
      <div className="relative flex items-center gap-2 w-full py-2 px-4 border border-muted rounded-lg bg-background">
        <div className="absolute left-0 top-0 h-full w-px bg-muted">
          {isAuthor ? (
            <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
          ) : (
            <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-muted rounded-full" />
          )}
        </div>
        <Link href={`/user/${comment.author?.username || "unknown"}`}>
          <Image
            src={comment.author?.imageUrl || "/avatar-default.svg"}
            alt={`${comment.author?.username || "Unknown User"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
            width={32}
            height={32}
            loading="lazy"
            blurDataURL="/avatar-default.svg"
          />
        </Link>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/user/${comment.author?.username || "unknown"}`}
              className="hover:text-primary hover:underline"
            >
              {comment.author?.username}
            </Link>{" "}
            on {formatDate(comment.publishedAt)}
          </p>
          <p className="mt-1">{comment.content}</p>
        </div>
      </div>
      {isAuthor && (
        <Link
          className="text-sm text-muted-foreground hover:text-primary"
          href={""}
        >
          Edit Comment
        </Link>
      )}
      {!isAuthor && (
        <ReportButton
          contentType="comment"
          content={comment as Comment}
          iconSize={20}
          className="text-sm text-muted-foreground hover:text-primary"
        />
      )}
    </div>
  );
};

export default PostComment;
