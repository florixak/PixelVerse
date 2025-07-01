import { Button } from "@/components/ui/button";
import { Topic } from "@/sanity.types";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SortFilterSelect from "../sort-filter-select";
import TopicActions from "./topic-actions";

type TopicHeaderProps = {
  topic: Topic;
};

const TopicHeader = ({ topic }: TopicHeaderProps) => {
  if (!topic || !topic.slug) return null;
  return (
    <div className="flex flex-col items-start gap-4">
      {topic.bannerUrl && (
        <Image
          src={topic.bannerUrl}
          alt={`Banner for ${topic.title}`}
          width={1200}
          height={400}
          className="w-full h-64 object-cover rounded-lg"
          priority
        />
      )}
      <div className="flex items-center justify-center sm:items-start sm:justify-start flex-col w-full">
        <div className="flex flex-col md:flex-row items-center gap-2">
          {topic.iconUrl ? (
            <Image
              src={topic.iconUrl}
              alt={`Icon for ${topic.title}`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
              priority
            />
          ) : null}
          <h1 className="text-4xl font-bold">{topic.title}</h1>
        </div>

        <p className="text-muted-foreground">
          {topic.description || "No description available for this topic."}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Posts:</span> {topic.postCount || 0}
        </p>
        <TopicActions topic={topic} />
      </div>
    </div>
  );
};

export default TopicHeader;
