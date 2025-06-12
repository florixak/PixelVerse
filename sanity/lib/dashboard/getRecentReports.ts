import { groq } from "next-sanity";
import { client } from "../client";

export async function getRecentReports(limit = 5) {
  return client.fetch(
    groq`*[_type == "report" && status == "pending"] | order(reportedAt desc) [0...$limit] {
      _id,
      reason,
      status,
      reportedAt,
      contentType,
      "post": post-> {
        _id,
        title,
        "slug": slug.current,
        "topicSlug": topic->slug.current,
        author->{
          _id,
          username,
          imageUrl,
          clerkId,
          role,
          isBanned}
      },
      "comment": comment-> {
        _id,
        content,
        "postId": post->_id,
        "postTitle": post->title,
        author->{
          _id,
          username,
          imageUrl,
          clerkId,
          role,
          isBanned}
      },
      "reporter": reporter-> {
        _id,
        username,
        imageUrl,
        clerkId,
        role
      }
    }`,
    { limit: limit - 1 }
  );
}
