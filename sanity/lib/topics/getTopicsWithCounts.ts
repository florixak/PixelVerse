import { groq } from "next-sanity";
import { client } from "../client";
import { Topic } from "@/sanity.types";

export const getTopicsWithCounts = async (): Promise<Topic[]> => {
  return client.fetch(
    groq`*[_type == "topic"] {
      _id,
      title,
      "slug": slug.current,
      description,
      "iconUrl": icon.asset->url,
      "postCount": count(*[_type == "post" && references(^._id)])
    } | order(postCount desc)`
  );
};
