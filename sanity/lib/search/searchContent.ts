import { groq } from "next-sanity";
import { client } from "../client";

const searchContent = async (query: string) => {
  if (!query || query.trim() === "") {
    return Promise.resolve({ posts: [], topics: [] });
  }

  return client.fetch(
    groq`{
      "posts": *[_type == "post" && (title match $query || excerpt match $query)] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        postType,
        "topic": topic->{_id, title, "slug": slug.current}
      } | order(publishedAt desc)[0...5],
      "topics": *[_type == "topic" && (title match $query || description match $query)] {
        _id,
        title,
        "slug": slug.current,
        description,
        "iconUrl": icon.asset->url
      } | order(title asc)[0...5]
    }`
  );
};

export default searchContent;
