import { groq } from "next-sanity";
import { client } from "../client";

const getAllPosts = async () => {
  return client.fetch(
    groq`*[_type == "post" && isDeleted != true] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      updatedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role},
      "topic": topic->{_id, title, "slug": slug.current},
      "likes": count(reactions[type == "like"]),
      "dislikes": count(reactions[type == "dislike"]),
      tags,
      dimensions,
      software,
      isDeleted,
      "commentsCount": count(*[_type == "comment" && references(^._id)]),
    }`
  );
};

export default getAllPosts;
