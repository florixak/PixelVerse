"use client";

import { reactOnPost } from "@/actions/postActions";
import { cn } from "@/lib/utils";
import { Post, Reaction, User } from "@/sanity.types";
import { useClerk } from "@clerk/nextjs";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  FlagTriangleRight,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactionButton from "../reaction-button";
import { useRouter } from "next/navigation";

type PostReactionsProps = {
  post: Post;
  currentUserClerkId?: User["clerkId"];
  collapsed?: boolean;
  className?: string;
  commentsLink?: string;
};

const PostReactions = ({
  post,
  currentUserClerkId,
  collapsed = false,
  className = "",
  commentsLink = "",
}: PostReactionsProps) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [userReactionState, setUserReactionState] = useState<Reaction["type"]>(
    post.reactions?.find(
      (reaction) => reaction.user?.clerkId === currentUserClerkId
    )?.type || null
  );
  const clerk = useClerk();
  const router = useRouter();

  const handleLike = async () => {
    if (!clerk.user) {
      toast.error("You must be logged in to like a post.");
      clerk.openSignIn();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const newLikes = userReactionState === "like" ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setUserReactionState(userReactionState === "like" ? null : "like");
      await reactOnPost(post._id, "like");
    } catch (error) {
      console.error("Error liking post:", error);

      setLikes(userReactionState === "like" ? likes - 1 : likes + 1);
      setUserReactionState(userReactionState === "like" ? null : "like");
      toast.error("Failed to like the post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!clerk.user) {
      toast.error("You must be logged in to like a post.");
      clerk.openSignIn();
      return;
    }
    if (isDisliking) return;
    setIsDisliking(true);

    try {
      const newDislikes =
        userReactionState === "dislike" ? dislikes - 1 : dislikes + 1;
      setDislikes(newDislikes);
      setUserReactionState(userReactionState === "dislike" ? null : "dislike");
      await reactOnPost(post._id, "dislike");
    } catch (error) {
      console.error("Error disliking post:", error);

      setDislikes(
        userReactionState === "dislike" ? dislikes - 1 : dislikes + 1
      );
      setUserReactionState(userReactionState === "dislike" ? null : "dislike");
      toast.error("Failed to dislike the post. Please try again.");
    } finally {
      setIsDisliking(false);
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
          console.log("User canceled share operation");
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

  const handleReportClick = () => {
    if (!clerk.user) {
      toast.error("You must be logged in to report a post.");
      clerk.openSignIn();
      return;
    }
    router.push(`/report/post/${post.slug}`);
  };

  return (
    <div
      className={cn(
        `mt-4 text-muted-foreground flex flex-row justify-between gap-3`,
        className
      )}
    >
      <div className="flex items-center gap-4">
        <ReactionButton
          icon={
            <ThumbsUp className="inline-block text-blue-500 cursor-pointer" />
          }
          count={likes}
          disabled={userReactionState === "like" || isLiking}
          onClick={handleLike}
          isLoading={isLiking}
          activeColor="text-green-400"
          showLabel={!collapsed}
          label="likes"
          title={`${likes} likes`}
        />
        <ReactionButton
          icon={
            <ThumbsDown className="inline-block text-red-500 cursor-pointer" />
          }
          count={dislikes}
          disabled={userReactionState === "dislike" || isDisliking}
          onClick={handleDislike}
          isLoading={isDisliking}
          activeColor="text-red-400"
          showLabel={!collapsed}
          label="dislikes"
          title={`${dislikes} dislikes`}
        />
        <ReactionButton
          icon={<MessageCircle className="inline-block text-gray-500" />}
          count={post.commentsCount || 0}
          disabled={false}
          onClick={handleCommentClick}
          showLabel={!collapsed}
          label="comments"
          title={`${post.commentsCount} comments`}
        />
      </div>

      <div className="flex items-center gap-4">
        <ReactionButton
          icon={<Share2 className="inline-block text-gray-500" />}
          disabled={false}
          onClick={handleShareClick}
          showLabel={true}
          label="Share"
          title="Share this post"
        />

        <ReactionButton
          icon={<FlagTriangleRight className="inline-block text-gray-500" />}
          disabled={false}
          onClick={handleReportClick}
          showLabel={true}
          label="Report"
          title="Report this post"
        />
      </div>
    </div>
  );
};

export default PostReactions;
