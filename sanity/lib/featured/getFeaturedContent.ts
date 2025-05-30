import { groq } from "next-sanity";
import { client } from "../client";

const getFeaturedContent = () => {
  return client.fetch(
    groq`{
      "featuredPosts": *[_type == "post"] | order(upvotes desc)[0...6] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        postType,
        "imageUrl": image.asset->url,
        "author": author->{username, "imageUrl": imageUrl},
        "topic": topic->{title, "slug": slug.current},
        upvotes
      },
      "popularTopics": *[_type == "topic"] {
        _id,
        title,
        "slug": slug.current,
        "iconUrl": icon.asset->url,
        "postCount": count(*[_type == "post" && references(^._id)])
      } | order(postCount desc)[0...8]
    }`
  );
};

export default getFeaturedContent;
