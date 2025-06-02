import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

type GetAllTopicsParams = {
  limit?: number;
  order?: "alphabetical" | "latest";
  from?: number;
};

const getAllTopics = async ({
  limit = 10,
  order = "alphabetical",
  from = 0,
}: GetAllTopicsParams): Promise<Topic[]> => {
  return client.fetch(
    groq`*[_type == "topic"] | order(${
      order === "alphabetical" ? "title" : "_createdAt"
    } ${order === "latest" ? "desc" : "asc"})[${from}...${from + limit}] {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      updatedAt,
        "iconUrl": icon.asset->url,
        "bannerUrl": banner.asset->url,
        "postCount": count(*[_type == "post" && references(^._id)])
    }`
  );
};

export default getAllTopics;
