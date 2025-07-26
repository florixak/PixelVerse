import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";
import { SortOrder } from "@/types/filter";

type GetAllTopicsParams = {
  limit?: number;
  sort?: SortOrder;
  from?: number;
};

const getAllTopics = async ({
  limit = 10,
  sort = "latest",
  from = 0,
}: GetAllTopicsParams): Promise<Topic[]> => {
  let sortCriteria = "";

  switch (sort) {
    case "alphabetical":
      sortCriteria = "order(title asc)";
      break;
    case "latest":
      sortCriteria = "order(_createdAt desc)";
      break;
    case "oldest":
      sortCriteria = "order(_createdAt asc)";
      break;
    case "trending":
      sortCriteria =
        "order(count(*[_type == 'post' && references(^._id) && isDeleted != true]) desc)";
      break;
    case "popular":
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentTimestamp = sevenDaysAgo.toISOString();

      sortCriteria = `order(count(*[_type == 'post' && references(^._id) && _createdAt > '${recentTimestamp}' && isDeleted != true]) desc)`;
      break;
    default:
      sortCriteria = "order(title asc)";
  }

  return client.fetch(
    groq`*[_type == "topic"] | ${sortCriteria}[${from}...${from + limit}] {
      _id,
      title,
      "slug": slug.current,
      description,
      publishedAt,
      updatedAt,
      "iconUrl": icon.asset->url,
      "bannerUrl": banner.asset->url,
      "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true && isBanned != true]),
    }`
  );
};

export default getAllTopics;
