"use client";

import { useState } from "react";
import AdminSuggestTopicButton from "./admin-suggest-topic-button";
import { SuggestedTopic } from "@/sanity.types";
import { approveTopic, rejectTopic } from "@/actions/topic-suggestion-actions";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const AdminSuggestTopicButtons = ({ topic }: { topic: SuggestedTopic }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async (id: string) => {
    try {
      setIsApproving(true);
      await approveTopic(id);
    } catch (error) {
      toast.error("Error approving topic");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsRejecting(true);
      await rejectTopic(id);
    } catch (error) {
      toast.error("Error rejecting topic");
    } finally {
      setIsRejecting(false);
    }
  };

  return topic.status === "published" ? (
    <Button variant="link" asChild>
      <Link
        href={`/topics/${topic.slug}`}
        className="text-sm flex items-center text-primary hover:underline"
        target="_blank"
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        View Live Topic
      </Link>
    </Button>
  ) : (
    <div className="flex gap-2">
      <AdminSuggestTopicButton
        onClick={handleApprove}
        topicId={topic._id}
        disabled={isApproving || isRejecting}
      >
        {isApproving ? "Approving..." : "Approve"}
      </AdminSuggestTopicButton>
      <AdminSuggestTopicButton
        onClick={handleReject}
        topicId={topic._id}
        disabled={isRejecting || isApproving}
        variant="destructive"
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </AdminSuggestTopicButton>
    </div>
  );
};

export default AdminSuggestTopicButtons;
