// sanity/lib/reports/getAllReports.ts
import { groq } from "next-sanity";
import { client } from "../client";
import { Report, User } from "@/sanity.types";
import { canAccessDashboard } from "@/lib/user-utils";

const getAllReports = async (
  clerkId: User["clerkId"],
  limit: number = 50
): Promise<Report[]> => {
  if (!(await canAccessDashboard(clerkId))) {
    throw new Error("Not authorized to view reports");
  }

  return client.fetch(
    groq`*[_type == "report"] | order(reportedAt desc) [0...$limit] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      reason,
      additionalInfo,
      reportedAt,
      status,
      
      // Expand post reference with nested author
      "post": post-> {
        _id,
        title,
        "slug": slug.current,
        "topicSlug": topic->slug.current,
        content,
        publishedAt,
        postType,
        imageUrl,
        author->{ 
          _id,
          username,
          imageUrl,
          clerkId,
          role,
          isBanned
          }
      },
      
      // Expand comment reference if present
      "comment": comment-> {
        _id,
        content,
        publishedAt,
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
      
      // Expand reporter reference
      "reporter": reporter-> {
        _id,
        username,
        imageUrl,
        clerkId,
        role
      },
      
      // Moderation fields
      moderationNotes,
      moderatedAt,
      "moderatedBy": moderatedBy-> {
        _id,
        username,
        imageUrl,
        role
      }
    }`,
    { limit }
  );
};

export default getAllReports;
