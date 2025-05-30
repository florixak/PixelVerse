import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";

const getPostsByTopic = async (topicSlug: string): Promise<Post[]> => {
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

export default getPostsByTopic;
