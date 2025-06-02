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
      "postCount": count(*[_type == "post" && references(^._id)])
    } | order(postCount desc)[0...8]
  `);
};
