"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/nextjs";
import { Comment, Post, Report, User } from "@/sanity.types";
import ReactionButton from "../reaction-button";
import { FlagTriangleRight } from "lucide-react";

type ReportButtonProps = {
  contentType: Report["contentType"];
  content: Post | Comment | User;
  iconSize?: number;
  className?: string;
  collapsed?: boolean;
};

const ReportButton = ({
  contentType,
  content,
  iconSize = 24,
  className = "",
  collapsed = false,
}: ReportButtonProps) => {
  const router = useRouter();
  const { user, openSignIn } = useClerk();

  const getReportUrl = (): string => {
    switch (contentType) {
      case "post":
        const post = content as Post;
        return `/report/post/${post.slug}`;
      case "comment":
        const comment = content as Comment;
        return `/report/comment/${comment._id}`;
      case "user":
        const reportedUser = content as User;
        return `/report/user/${reportedUser.username}`;
      default:
        return "/";
    }
  };

  const handleReportClick = () => {
    if (!user) {
      toast.error(`You must be logged in to report this ${contentType}.`);
      openSignIn();
      return;
    }
    router.push(getReportUrl());
  };

  const getLabel = (): string => {
    switch (contentType) {
      case "user":
        return "Report User";
      default:
        return "Report";
    }
  };

  return (
    <ReactionButton
      icon={
        <FlagTriangleRight
          className="inline-block text-muted-foreground"
          size={iconSize}
        />
      }
      disabled={false}
      onClick={handleReportClick}
      showLabel={!collapsed}
      label={getLabel()}
      title={`Report this ${contentType}`}
      className={className}
    />
  );
};

export default ReportButton;
