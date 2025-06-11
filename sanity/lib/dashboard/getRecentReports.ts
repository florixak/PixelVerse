import { groq } from "next-sanity";
import { client } from "../client";

export async function getRecentReports(limit = 5) {
  return client.fetch(
    groq`*[_type == "report" && status == "pending"] | order(reportedAt desc) [0...$limit] {
      _id,
      reason,
      status,
      reportedAt,
      
      // Expand post reference
      "post": post-> {
        _id,
        title,
        "slug": slug.current,
        "topicSlug": topic->slug.current
      },
      
      // Expand comment reference
      "comment": comment-> {
        _id,
        content,
        "postId": post->_id,
        "postTitle": post->title
      },
      
      // Expand reporter reference
      "reporter": reporter-> {
        _id,
        username,
        imageUrl
      }
    }`,
    { limit: limit - 1 }
  );
}
