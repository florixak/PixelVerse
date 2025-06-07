import React from "react";
import TopicCardSkeleton from "./topic-card-skeleton";

const PopularTopicsSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <TopicCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default PopularTopicsSkeleton;
