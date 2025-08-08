"use server";

import { SanityImageAsset, SuggestedTopic, Topic } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";

export const addTopic = async ({
  title,
  description,
  icon,
  banner,
  slug,
}: {
  title: Topic["title"];
  description: Topic["description"];
  icon: SuggestedTopic["icon"];
  banner: SuggestedTopic["banner"];
  slug: Topic["slug"];
}): Promise<void> => {
  if (!title || !description) {
    throw new Error("Invalid topic data");
  }

  await writeClient.create({
    _type: "topic",
    slug: {
      _type: "slug",
      current: slug,
    },
    title,
    description,
    icon,
    banner,
  });
};
