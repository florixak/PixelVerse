import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

export type getPostsForSitemapReturn = Pick<
  Post,
  "slug" | "topicSlug" | "publishedAt" | "_updatedAt"
>[];

const getPostsForSitemap = async (): Promise<getPostsForSitemapReturn> => {
  return client.fetch<Post[]>(
    groq`*[_type == "post" && isDeleted != true && author->isBanned != true] {
      "slug": slug.current,
      "topicSlug": topic->slug.current,
      publishedAt,
      _updatedAt,
    } | order(publishedAt desc) [0...2000]`
  );
};

export default getPostsForSitemap;
