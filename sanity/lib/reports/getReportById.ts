import { groq } from "next-sanity";
import { client } from "../client";
import { Report } from "@/sanity.types";

export async function getReportById(id: string): Promise<Report | null> {
  return client.fetch(
    groq`*[_type == "report" && _id == $id][0] {
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
            publishedAt,
            "author": author->{
              _id,
              username,
              imageUrl
            }
          },
          _type == "comment" => {
            content,
            publishedAt,
            "postId": post->_id,
            "postTitle": post->title,
            "postSlug": post->slug.current,
            "topicSlug": post->topic->slug.current,
            "author": author->{
              _id,
              username,
              imageUrl
            },
            "post": post->{
        _id,
        title,
        "slug": slug.current,
        "topicSlug": topic->slug.current
          },
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
    }`,
    { id }
  );
}
