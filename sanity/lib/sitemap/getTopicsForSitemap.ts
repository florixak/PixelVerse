import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

const getTopicsForSitemap = async (): Promise<Topic[]> => {
  return client.fetch(
    groq`*[
      _type == "topic" && 
      defined(slug.current)
    ] {
      "slug": slug.current,
      _updatedAt
    } | order(_updatedAt desc)`
  );
};

export default getTopicsForSitemap;
