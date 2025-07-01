import { Button } from "@/components/ui/button";
import SortFilterSelect from "@/components/sort-filter-select";
import { Topic } from "@/sanity.types";
import { Plus } from "lucide-react";
import Link from "next/link";

type TopicActionsProps = {
  topic: Topic;
};

const TopicActions = ({ topic }: TopicActionsProps) => {
  if (!topic || !topic.slug) return null;
  return (
    <div className="max-w-xs w-full flex items-center justify-center sm:justify-start gap-2 mt-4">
      <Button variant="outline" asChild>
        <Link
          href={`/create-post?topic=${encodeURIComponent(topic.slug)}`}
          className="flex items-center gap-2"
        >
          <span>Create New Post</span>
          <Plus />
        </Link>
      </Button>
      <SortFilterSelect />
    </div>
  );
};

export default TopicActions;
