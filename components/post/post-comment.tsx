"use client";

import { formatDate } from "@/lib/utils";
import { Comment, User } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { OptimisticComment } from "./post-comment-form";
import ReportButton from "../report/report-button";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Edit } from "lucide-react";
import { updateComment } from "@/actions/post-actions";

type PostCommentProps = {
  comment: Comment | OptimisticComment;
  currentUserId?: User["clerkId"];
};

const PostComment = ({ comment, currentUserId }: PostCommentProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string | undefined>(
    comment.content
  );
  const isEdited = (comment as Comment).isEdited || false;
  const isAuthor = comment.author?.clerkId === currentUserId;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentContent && comment._id) {
      updateComment(comment._id, commentContent)
        .then(() => {
          setIsEditing(false);
          setCommentContent(commentContent);
        })
        .catch((error) => {
          console.error("Failed to update comment:", error);
        });
    }
  };

  return (
    <div
      id={`comment-${comment._id}`}
      className="flex flex-col gap-2 mb-4 w-full"
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
        <div className="p-4 rounded-lg bg-muted w-full">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/user/${comment.author?.username || "unknown"}`}
              className="hover:text-primary hover:underline"
            >
              {comment.author?.username}
            </Link>{" "}
            on {formatDate(comment.publishedAt)}
            {isEdited ? " (edited)" : ""}
          </p>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <Textarea
                value={commentContent}
                onChange={handleContentChange}
                className="mt-2"
                rows={3}
              />
              <div className="flex justify-end items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-muted-foreground hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button className="text-sm text-primary hover:underline cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-1 break-words">{commentContent}</p>
          )}
        </div>
        <div className="absolute flex gap-2 items-center justify-end right-6 top-5">
          {isAuthor && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-primary cursor-pointer"
            >
              <Edit />
            </button>
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
      </div>
    </div>
  );
};

export default PostComment;
