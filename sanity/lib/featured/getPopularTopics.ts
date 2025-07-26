import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

export const getPopularTopics = async (): Promise<Topic[]> => {
  return client.fetch(groq`
    *[_type == "topic"] {
      _id,
      title,
      "slug": slug.current,
      "iconUrl": icon.asset->url,
      "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true && author->isBanned != true && isBanned != true]),
      "postCountWeek": count(*[_type == "post" && references(^._id) && isDeleted != true && author->isBanned != true && isBanned != true && _createdAt >= now() - 7 * 24 * 60 * 60]),
      "postCountMonth": count(*[_type == "post" && references(^._id) && isDeleted != true && author->isBanned != true && isBanned != true && _createdAt >= now() - 30 * 24 * 60 * 60]),
    } | order(postCount desc)[0...5]
  `);
};
