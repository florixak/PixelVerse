import React from "react";
import { Topic } from "@/sanity.types";
import Link from "next/link";
import Card from "../card";
import Image from "next/image";

type TopicCardProps = {
  topic: Topic;
};

const TopicCard = ({ topic }: TopicCardProps) => {
  return (
    <Card>
      {topic.iconUrl && (
        <Image
          src={topic.iconUrl}
          alt={topic.title || "Topic Icon"}
          className="w-full object-cover rounded-lg"
          width={400}
          height={400}
          loading="lazy"
          blurDataURL={topic.iconUrl}
          placeholder="blur"
        />
      )}
      <Link href={`/topics/${topic.slug}`}>
        <h2 className="text-xl font-bold mt-2">{topic.title}</h2>
      </Link>
      <p className="text-sm text-muted-foreground">{topic.description}</p>
      <p>
        <span className="font-semibold">Posts:</span> {topic.postCount}
      </p>
    </Card>
  );
};

export default TopicCard;
