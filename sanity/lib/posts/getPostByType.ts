import { groq } from "next-sanity";

import { client } from "../client";

const getPostByType = async (postType: string) => {
  return client.fetch(
    groq`*[_type == "post" && postType == $postType] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl},
      "topic": topic->{_id, title, "slug": slug.current},
      upvotes,
      downvotes
    } | order(publishedAt desc)`,
    { postType }
  );
};

export default getPostByType;
