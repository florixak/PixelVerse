"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { Comment, Post } from "@/sanity.types";
import AuthButtons from "../auth-buttons";
import { toast } from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { createComment } from "@/actions/post-actions";
import PostOptimisticComments from "./post-optimistic-commets";

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

type PostCommentFormData = {
  content: Comment["content"];
};

const postContentSchema = z.object({
  content: z.string().min(2).max(500).trim(),
});

const PostCommentForm = ({ post }: PostCommentFormProps) => {
  const { user } = useUser();
  const [optimisticComments, setOptimisticComments] = useState<
    OptimisticComment[]
  >([]);

  const form = useForm({
    defaultValues: { content: "" } as PostCommentFormData,
    validators: { onChange: postContentSchema },
    onSubmit: async ({ value }) => {
      if (!value.content) {
        return toast.error("Please enter a comment.");
      }
      const content = value?.content.trim();
      if (!content) {
        return toast.error("Comment content cannot be empty.");
      }

      const tempId = `temp-${Date.now()}`;
      const optimisticComment: OptimisticComment = {
        _id: tempId,
        content,
        publishedAt: new Date().toISOString(),
        isOptimistic: true,
      };
      if (user) {
        setOptimisticComments((prev) => [optimisticComment, ...prev]);
      }

      try {
        const comment = await createComment({
          postId: post._id,
          content,
        });

        if (!comment) {
          setOptimisticComments((prev) => prev.filter((c) => c._id !== tempId));
          return toast.error("Failed to create comment. Please try again.");
        }

        setOptimisticComments((prev) => prev.filter((c) => c._id !== tempId));

        form.reset();

        toast.success("Comment posted!");
      } catch (error) {
        setOptimisticComments((prev) => prev.filter((c) => c._id !== tempId));
        toast.error("Failed to create comment. Please try again.");
      }
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
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
            src={user?.imageUrl ? user.imageUrl : "/avatar-default.svg"}
            alt={`${user?.username ? user.username : "Anonymous"}'s avatar`}
            className="w-10 h-10 rounded-full object-cover mt-2"
            width={32}
            height={32}
            loading="lazy"
            blurDataURL="/avatar-default.svg"
          />
          <form.Field name="content">
            {(field) => (
              <Textarea
                className="w-full p-2 border border-muted rounded-lg min-h-[80px] max-h-[200px]"
                placeholder="Write a comment..."
                rows={3}
                required
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
              />
            )}
          </form.Field>
        </div>
        <div className="flex justify-end items-center gap-2">
          {!user ? (
            <AuthButtons />
          ) : (
            <form.Subscribe
              selector={(state) => {
                return {
                  isSubmitting: state.isSubmitting,
                  isValid: state.isValid,
                  isDirty: state.isDirty,
                };
              }}
            >
              {(field) => (
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={
                    optimisticComments.length > 0 ||
                    !field.isValid ||
                    !field.isDirty
                  }
                >
                  {field.isSubmitting ? "Submitting..." : "Submit Comment"}
                </Button>
              )}
            </form.Subscribe>
          )}
        </div>
      </form>
      <p className="text-muted-foreground text-center text-sm mt-2">
        Comments are visible to everyone. Please be respectful and follow our
        community guidelines.
      </p>
      <PostOptimisticComments
        optimisticComments={optimisticComments}
        user={user}
        post={post}
      />
    </>
  );
};

export default PostCommentForm;
