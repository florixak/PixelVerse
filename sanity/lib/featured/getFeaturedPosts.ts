import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

export const getFeaturedPosts = async (): Promise<Post[]> => {
  return client.fetch(
    groq`
      *[_type == "post"] | order(upvotes desc)[0...6] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        postType,
        "imageUrl": image.asset->url,
        "author": author->{username, "imageUrl": imageUrl, clerkId},
        "topic": topic->{title, "slug": slug.current},
        upvotes
      }
    `
  );
};
