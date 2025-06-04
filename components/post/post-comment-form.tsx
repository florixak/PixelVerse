"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { createComment } from "@/actions/postActions";
import { Comment, Post } from "@/sanity.types";
import toast from "react-hot-toast";
import { useActionState, useEffect, useRef, useState } from "react";
import SubmitButton from "../submit-button";
import PostComment from "./post-comment";
import PostCommentsWrapper from "./post-comments-wrapper";

type PostCommentFormProps = {
  post: Post;
};

export type OptimisticComment = Pick<
  Comment,
  "_id" | "content" | "publishedAt"
> & {
  isOptimistic: boolean;
  author?: {
    username?: string;
    imageUrl?: string;
    clerkId?: string;
  };
};

type CommentFormState =
  | { success: boolean; error?: undefined }
  | { error: string; success?: undefined };

const initialState: CommentFormState = {
  success: false,
  error: undefined,
};

const PostCommentForm = ({ post }: PostCommentFormProps) => {
  const { user } = useUser();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createComment, initialState);
  const [optimisticComments, setOptimisticComments] = useState<
    OptimisticComment[]
  >([]);

  const handleSubmit = (formData: FormData) => {
    const content = formData.get("content") as string;

    if (content && user) {
      setOptimisticComments([
        {
          _id: `temp-${Date.now()}`,
          content,
          publishedAt: new Date().toISOString(),
          isOptimistic: true,
        },
        ...optimisticComments,
      ]);

      formAction(formData);
    }
  };

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }

    if (state.success) {
      toast.success("Comment posted successfully!");
      formRef.current?.reset();
    }
  }, [state]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-muted rounded-lg bg-background">
        <p className="text-muted-foreground">Please log in to comment.</p>
      </div>
    );
  }

  return (
    <>
      <form
        ref={formRef}
        action={handleSubmit}
        className="flex flex-col gap-2 p-4 border border-muted rounded-lg bg-background w-full"
      >
        <input
          type="hidden"
          name="postInformation"
          value={JSON.stringify({
            postId: post._id,
            topicSlug: post.topicSlug,
            postSlug: post.slug,
          })}
        />

        <div className="flex flex-row items-start gap-2 w-full">
          <Image
            src={user?.imageUrl || "/avatar-default.svg"}
            alt={`${user?.username || "Anonymous"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover mt-2"
            width={40}
            height={40}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/avatar-default.svg"
          />
          <Textarea
            name="content"
            className="w-full p-2 border border-muted rounded-lg min-h-[80px] max-h-[200px]"
            placeholder="Write a comment..."
            rows={3}
            required
          />
        </div>

        <SubmitButton label="Post Comment" submittingLabel="Posting..." />
      </form>
      {optimisticComments.length > 0 && (
        <PostCommentsWrapper>
          {optimisticComments.map((comment) => (
            <PostComment
              key={comment._id}
              comment={{
                ...comment,
                author: {
                  username: user?.username || "Anonymous",
                  imageUrl: user?.imageUrl || "/avatar-default.svg",
                  clerkId: user?.id || "unknown",
                },
              }}
            />
          ))}
        </PostCommentsWrapper>
      )}
    </>
  );
};

export default PostCommentForm;
