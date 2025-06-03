"use client";

import { reactOnPost } from "@/actions/postActions";
import { Post, Reaction, User } from "@/sanity.types";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type PostReactionsProps = {
  postId: string;
  reactions: Reaction[];
  currentUserClerkId: User["clerkId"];
};

const PostReactions = ({
  postId,
  currentUserClerkId,
  reactions,
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

  return (
    <div className="mt-4 text-gray-700 flex flex-row justify-end gap-3">
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
    </div>
  );
};

export default PostReactions;
