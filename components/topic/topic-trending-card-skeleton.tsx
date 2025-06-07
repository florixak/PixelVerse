import React from "react";
import Card from "../card";
import { Skeleton } from "../ui/skeleton";

const TopicTrendingCardSkeleton = () => {
  return (
    <Card className="flex flex-row items-center gap-2 p-4 w-full h-20">
      <div className="flex items-center justify-center min-w-[80px] h-16 p-2">
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </Card>
  );
};

const TrendingTopicsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <TopicTrendingCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default TrendingTopicsSkeleton;
export { TopicTrendingCardSkeleton };
