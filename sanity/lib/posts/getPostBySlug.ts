import { client } from "../client";
import { groq } from "next-sanity";

const getPostBySlug = (topicSlug: string) => {
  return client.fetch(
    groq`*[_type == "post" && references(*[_type == "topic" && slug.current == $topicSlug]._id)] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl},
      dimensions,
      software,
      upvotes,
      downvotes,
      tags
    } | order(publishedAt desc)`,
    { topicSlug }
  );
};

export default getPostBySlug;
