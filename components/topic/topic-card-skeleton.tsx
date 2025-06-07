import Card from "../card";
import { Skeleton } from "../ui/skeleton";

const TopicCardSkeleton = () => {
  return (
    <Card className="flex flex-col gap-3 p-4 w-full">
      <Skeleton className="w-full h-36 rounded-lg" />

      <Skeleton className="h-7 w-3/4" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-8" />
      </div>
    </Card>
  );
};

export default TopicCardSkeleton;
