import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Topic } from "@/sanity.types";
import Link from "next/link";
import React from "react";

type CompactTopicCardProps = {
  topic: Topic;
};

const CompactTopicCard = ({ topic }: CompactTopicCardProps) => {
  return (
    <Link
      href={`/admin/topics/${topic.slug}`}
      className="block border rounded-md hover:bg-muted/50 transition-colors"
      title={topic.title || "Topic"}
    >
      <div className="flex items-center p-2.5">
        {/* Avatar */}
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage
            src={topic.bannerUrl}
            alt={topic.title || "Topic"}
            className="object-cover"
          />
          <AvatarFallback>
            {topic?.title?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Topic info */}
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            <p className="text-xs font-medium truncate">
              {topic.title || "Untitled Topic"}
            </p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            Posts:{" "}
            <span className="truncate mr-1.5">
              {topic.postCount || "No posts"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompactTopicCard;
