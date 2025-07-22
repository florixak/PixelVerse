import { client } from "../client";
import { groq } from "next-sanity";
import { Post } from "@/sanity.types";

type ExplorePostsParams = {
  search?: string;
  topicSlug?: string;
  sortBy?: "latest" | "popular" | "comments" | "likes";
  limit?: number;
  page?: number;
};

export async function getExploreContent({
  search = "",
  topicSlug = "",
  sortBy = "latest",
  limit = 12,
  page = 1,
}: ExplorePostsParams = {}): Promise<{ posts: Post[]; total: number }> {
  const start = (page - 1) * limit;
  const end = start + limit;

  let sortConfig = "order(publishedAt desc)";
  if (sortBy === "popular") {
    sortConfig =
      "order((coalesce(likes, 0) * 2) + (coalesce(viewCount, 0) * 0.5) desc)";
  } else if (sortBy === "comments") {
    sortConfig = "order(commentCount desc)";
  } else if (sortBy === "likes") {
    sortConfig = "order(coalesce(likes, 0) desc)";
  }

  const safeSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  const result = await client.fetch(
    groq`{
      "posts": *[
        _type == "post" && 
        defined(slug.current) && 
        publishedAt < now() && 
        isDeleted != true && isBanned != true &&
        author->isBanned != true &&
        ${topicSlug ? `&& topic->slug.current == "${topicSlug}"` : ""}
        ${
          search
            ? `&& (
          lower(title) match "*${safeSearch.toLowerCase()}*" || 
          lower(excerpt) match "*${safeSearch.toLowerCase()}*" || 
          defined(content) && lower(pt::text(content)) match "*${safeSearch.toLowerCase()}*"
        )`
            : ""
        }
      ] {
        _id,
        _type,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        "imageUrl": mainImage.asset->url,
        "likes": coalesce(likes, 0),
        "commentCount": count(*[_type == "comment" && references(^._id) && isBanned != true && isDeleted != true]),
        "viewCount": coalesce(viewCount, 0),
        disabledComments,
        "author": author->{
          _id, 
          username, 
          "imageUrl": image.asset->url
        },
        "topic": topic->{
          _id, 
          title, 
          "slug": slug.current, 
          color
        }
      } | ${sortConfig} [${start}...${end}],
      
      "total": count(*[
        _type == "post" && 
        defined(slug.current) && 
        publishedAt < now() && 
        isDeleted != true && isBanned != true && author->isBanned != true &&
        ${topicSlug ? `&& topic->slug.current == "${topicSlug}"` : ""}
        ${
          search
            ? `&& (
          lower(title) match "*${safeSearch.toLowerCase()}*" || 
          lower(excerpt) match "*${safeSearch.toLowerCase()}*" || 
          defined(content) && lower(pt::text(content)) match "*${safeSearch.toLowerCase()}*"
        )`
            : ""
        }
      ])
    }`
  );

  return result;
}
