import React from "react";
import Card from "./card";
import { Topic } from "@/sanity.types";
import { Button } from "./ui/button";
import Link from "next/link";

type TopicCardProps = {
  topic: Topic;
};

const TopicCard = ({ topic }: TopicCardProps) => {
  return (
    <Card>
      {topic.bannerUrl && (
        <img
          src={topic.bannerUrl}
          alt={topic.title}
          className="w-full object-cover rounded-lg"
        />
      )}
      <h2 className="text-xl font-bold mt-2">{topic.title}</h2>
      <p className="text-sm text-gray-600">{topic.description}</p>
      <p>
        <span className="font-semibold">Posts:</span> {topic.postCount}
      </p>
      <Button asChild>
        <Link href={`/topics/${topic.slug}`}>View Topic</Link>
      </Button>
    </Card>
  );
};

export default TopicCard;
