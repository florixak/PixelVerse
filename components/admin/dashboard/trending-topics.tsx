import { getTrendingTopics } from "@/sanity/lib/dashboard";
import React from "react";

import CompactTopicCard from "./compact-topic-card";

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-1.5">
      {trendingTopics.map((topic) => (
        <CompactTopicCard key={topic._id} topic={topic} />
      ))}
    </div>
  );
};

export default TrendingTopics;
