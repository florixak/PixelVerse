"use client";

import { FlagTriangleRight } from "lucide-react";
import ReactionButton from "./reaction-button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/nextjs";
import { Comment, Post, Report, User } from "@/sanity.types";

type ReportButtonProps<T> = {
  contentType: Report["contentType"];
  content: Post | Comment | User;
};

const ReportButton = <T extends unknown>({
  contentType,
  content,
}: ReportButtonProps<T>) => {
  const router = useRouter();
  const { user, openSignIn } = useClerk();

  const getReportUrl = () => {
    switch (contentType) {
      case "post":
        const post = content as Post;
        return `/report/post/${post.slug}`;
      case "comment":
        const comment = content as Comment;
        return `/report/comment/${comment._id}`;
      case "user":
        const user = content as User;
        return `/report/user/${user.username}`;
      default:
        throw new Error("Invalid content type for reporting");
    }
  };

  const handleReportClick = () => {
    if (!user) {
      toast.error("You must be logged in to report a post.");
      openSignIn();
      return;
    }
    router.push(getReportUrl());
  };
  return (
    <ReactionButton
      icon={<FlagTriangleRight className="inline-block text-gray-500" />}
      disabled={false}
      onClick={handleReportClick}
      showLabel={true}
      label="Report"
      title={`Report this ${contentType}`}
    />
  );
};

export default ReportButton;
