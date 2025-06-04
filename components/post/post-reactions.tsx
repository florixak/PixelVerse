"use client";

import { reactOnPost } from "@/actions/postActions";
import { Post, Reaction, User } from "@/sanity.types";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type PostReactionsProps = {
  postId: Post["_id"];
  reactions: Reaction[];
  currentUserClerkId: User["clerkId"];
  commentsCount?: Post["commentsCount"];
};

const PostReactions = ({
  postId,
  currentUserClerkId,
  reactions,
  commentsCount = 0,
}: PostReactionsProps) => {
  const [likes, setLikes] = useState(
    reactions.filter((reaction) => reaction.type === "like").length
  );
  const [dislikes, setDislikes] = useState(
    reactions.filter((reaction) => reaction.type === "dislike").length
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [userReactionState, setUserReactionState] = useState<Reaction["type"]>(
    reactions.find((reaction) => reaction.user?.clerkId === currentUserClerkId)
      ?.type || null
  );

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const newLikes = userReactionState === "like" ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setUserReactionState(userReactionState === "like" ? null : "like");
      await reactOnPost(postId, "like");
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
    if (isDisliking) return;
    setIsDisliking(true);

    try {
      const newDislikes =
        userReactionState === "dislike" ? dislikes - 1 : dislikes + 1;
      setDislikes(newDislikes);
      setUserReactionState(userReactionState === "dislike" ? null : "dislike");
      await reactOnPost(postId, "dislike");
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
    scrollTo({
      top: document.getElementById("comments-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleShareClick = () => {
    // Implement share functionality here
    toast.success("Share functionality is not implemented yet.");
  };

  return (
    <div className="mt-4 text-gray-700 flex flex-row justify-between gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center cursor-pointer gap-1"
        >
          <ThumbsUp
            className={`inline-block text-blue-500 cursor-pointer ${
              userReactionState === "like" ? "text-green-400" : ""
            }`}
          />
          <span className="text-gray-700">{likes} likes</span>
        </button>
        <button
          onClick={handleDislike}
          disabled={isDisliking}
          className="flex items-center cursor-pointer gap-1"
        >
          <ThumbsDown
            className={`inline-block text-red-500 cursor-pointer ${
              userReactionState === "dislike" ? "text-red-700" : ""
            }`}
          />
          <span className="text-gray-700">{dislikes} dislikes</span>
        </button>
        <button
          className="flex items-center cursor-pointer gap-1"
          onClick={handleCommentClick}
        >
          <MessageCircle />
          <span className="text-gray-700">{commentsCount} Comments</span>
        </button>
      </div>

      <div>
        <button
          className="flex items-center cursor-pointer gap-1"
          onClick={handleShareClick}
        >
          <Share2 />
          <span className="text-gray-700">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostReactions;
