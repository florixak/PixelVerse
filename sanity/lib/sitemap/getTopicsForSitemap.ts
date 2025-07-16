import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

export type getTopicsForSitemapReturn = Pick<Topic, "slug" | "_updatedAt">[];

const getTopicsForSitemap = async (): Promise<getTopicsForSitemapReturn> => {
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
