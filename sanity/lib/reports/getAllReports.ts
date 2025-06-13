import { Report } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

export async function getAllReports(): Promise<Report[]> {
  return client.fetch(
    groq`*[_type == "report"] | order(reportedAt desc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      contentType,
      displayId,
      reason,
      additionalInfo,
      reportedAt,
      status,
      "reportedContent": content-> {
        _id,
        _type,
        ...select(
          _type == "post" => {
            title,
            "slug": slug.current,
            "topicSlug": topic->slug.current,
            content,
            "author": author->{
              _id,
              username,
              imageUrl
            }
          },
          _type == "comment" => {
            content,
            publishedAt,
            "post": post->{
              _id,
              title,
              "slug": slug.current,
              "topicSlug": topic->slug.current
            },
            "author": author->{
              _id,
              username,
              imageUrl
            }
          },
          _type == "user" => {
            username,
            imageUrl,
            bio
          }
        )
      },
      "reporter": reporter-> {
        _id,
        username,
        imageUrl
      },
      moderationNotes,
      moderatedAt,
      "moderatedBy": moderatedBy-> {
        _id,
        username,
        imageUrl
      }
    }`
  );
}
