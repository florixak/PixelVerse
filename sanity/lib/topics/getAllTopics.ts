import { Topic } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

type GetAllTopicsParams = {
  limit?: number;
  order?: "alphabetical" | "latest" | "oldest" | "popular" | "trending";
  from?: number;
};

const getAllTopics = async ({
  limit = 10,
  order = "alphabetical",
  from = 0,
}: GetAllTopicsParams): Promise<Topic[]> => {
  let sortCriteria = "";

  switch (order) {
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
      "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true]),
      "comments": *[
        _type == "comment" &&
        references(*[_type == "post" && references(^._id) && isDeleted != true]._id)
      ]{
        _id,
        content,
        author->{username, "imageUrl": imageUrl},
        publishedAt,
        parentComment,
        likes,
        dislikes,
        isEdited,
        lastEditedAt,
        pixelArtUrl,
        isDeleted
      } 
    }`
  );
};

export default getAllTopics;
