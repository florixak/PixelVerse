"use client";

import { cn } from "@/lib/utils";
import { Post, Reaction } from "@/sanity.types";
import { useClerk } from "@clerk/nextjs";
import { MessageCircle, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import ReactionButton from "../reaction-button";
import { useRouter } from "next/navigation";
import ReportButton from "../report-button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getReactions, handleReaction } from "@/actions/reaction-actions";
import { REACTIONS } from "@/constants";
import React from "react";
import { getQueryClient } from "@/lib/get-query-client";

type PostReactionsProps = {
  post: Post;
  collapsed?: boolean;
  className?: string;
  commentsLink?: string;
  clerkId?: string;
};

const PostReactions = ({
  post,
  collapsed = false,
  className = "",
  commentsLink = "",
  clerkId,
}: PostReactionsProps) => {
  const router = useRouter();
  const queryClient = getQueryClient();

  const queryKey = ["postReactions", post._id, clerkId];

  const {
    data: postReactions,
    isLoading: isPostReactionsLoading,
    isError: isPostReactionsError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { success, data } = await getReactions(post, clerkId);
      if (!success) {
        throw new Error("Failed to fetch post reactions");
      }
      return data;
    },
  });

  const reactionMutation = useMutation({
    mutationFn: async (reactionType: Reaction["type"]) => {
      const result = await handleReaction(post, reactionType);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (reactionType: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      if (
        previousData &&
        typeof previousData === "object" &&
        !Array.isArray(previousData)
      ) {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;

          const currentUserReaction = old.userReaction?.type;
          const newReactionCounts = { ...old.reactionCounts };

          if (currentUserReaction === reactionType) {
            newReactionCounts[reactionType] = Math.max(
              0,
              (newReactionCounts[reactionType] || 0) - 1
            );
            return {
              ...old,
              reactionCounts: newReactionCounts,
              userReaction: null,
            };
          }
          if (currentUserReaction && currentUserReaction !== reactionType) {
            newReactionCounts[currentUserReaction] = Math.max(
              0,
              (newReactionCounts[currentUserReaction] || 0) - 1
            );
          }

          newReactionCounts[reactionType] =
            (newReactionCounts[reactionType] || 0) + 1;

          return {
            ...old,
            reactionCounts: newReactionCounts,
            userReaction: { _id: "temp", type: reactionType },
          };
        });
      }

      return { previousData };
    },
    onError: (err, reactionType, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      console.error("Failed to handle reaction:", err);
      toast.error("Failed to handle reaction. Please try again.");
    },
  });

  const handleReactionClick = (reactionType: Reaction["type"]) => async () => {
    if (!clerkId) {
      toast.error("You must be signed in to react.");
      return;
    }

    try {
      await reactionMutation.mutateAsync(reactionType);
    } catch (error) {
      console.error("Failed to handle reaction:", error);
      toast.error("Failed to handle reaction. Please try again.");
    }
  };

  const handleCommentClick = () => {
    if (commentsLink) {
      router.push(commentsLink);
      return;
    }
    scrollTo({
      top: document.getElementById("comments")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleShareClick = async () => {
    const shareUrl = window.location.href;
    const shareTitle = "Check out this pixel art on PixelVerse!";
    const shareText = "I found this amazing pixel art, check it out!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name === "AbortError"
        ) {
          //console.log("User canceled share operation");
          return;
        }

        console.error("Error sharing:", error);
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Couldn't copy link. Try again or use the share menu.");
    }
  };

  return (
    <div
      className={cn(
        `mt-4 text-muted-foreground flex flex-row items-center justify-between gap-3`,
        className
      )}
    >
      <div className="flex items-center gap-4">
        {isPostReactionsLoading ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : isPostReactionsError ? (
          <div className="flex items-center justify-center">
            Error loading reactions.
          </div>
        ) : (
          REACTIONS.map((reaction) => {
            const reactionCountValue =
              postReactions?.reactionCounts[reaction.value];

            const userHasReacted =
              postReactions?.userReaction?.type === reaction.value;

            return (
              <ReactionButton
                key={reaction.value}
                icon={React.createElement(reaction.icon)}
                count={reactionCountValue || 0}
                disabled={isPostReactionsLoading}
                onClick={handleReactionClick(reaction.value)}
                showLabel={!collapsed}
                label={reaction.title + (reactionCountValue === 1 ? "" : "s")}
                title={`${reactionCountValue} ${reaction.title}s`}
                className={cn(
                  "text-muted-foreground",
                  userHasReacted ? reaction.color : ""
                )}
              />
            );
          })
        )}

        <ReactionButton
          icon={
            <MessageCircle className="inline-block text-muted-foreground" />
          }
          count={post.disabledComments ? 0 : post.commentsCount || 0}
          disabled={false}
          onClick={handleCommentClick}
          showLabel={!collapsed}
          label="comments"
          title={`${post.commentsCount} comments`}
        />
      </div>

      <div className="flex items-center gap-4">
        <ReactionButton
          icon={<Share2 className="inline-block text-muted-foreground" />}
          disabled={false}
          onClick={handleShareClick}
          showLabel={!collapsed}
          label="Share"
          title="Share this post"
        />

        <ReportButton contentType="post" content={post} collapsed={collapsed} />
      </div>
    </div>
  );
};

export default PostReactions;
