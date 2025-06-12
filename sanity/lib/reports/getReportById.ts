import { groq } from "next-sanity";
import { client } from "../client";
import { Report } from "@/sanity.types";

export async function getReportById(id: string): Promise<Report | null> {
  const report = await client.fetch(
    groq`*[_type == "report" && _id == $id][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      reason,
      additionalInfo,
      reportedAt,
      status,
      "post": post-> {
        _id,
        title,
        "slug": slug.current,
        "topicSlug": topic->slug.current,
        content,
        publishedAt,
        author->{
          _id,
          username,
          imageUrl
        }
      },
      "comment": comment-> {
        _id,
        content,
        publishedAt,
        "postId": post->_id,
        "postTitle": post->title,
        "postSlug": post->slug.current,
        "post": post-> {
        _id,
        title,
        "slug": slug.current,
        "topicSlug": topic->slug.current,
        content,
        publishedAt,
        author->{
          _id,
          username,
          imageUrl
        }
        },
        author->{
          _id,
          username,
          imageUrl
        }
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

  if (!report) return null;

  const statusPrefix =
    report.status === "pending"
      ? "P"
      : report.status === "resolved"
      ? "R"
      : "X";

  const reportDate = new Date(report.reportedAt);
  const dateComponent = reportDate.toISOString().slice(2, 10).replace(/-/g, "");

  const sequentialNumber = await client.fetch(
    groq`count(*[_type == "report" && reportedAt <= $reportedAt])`,
    { reportedAt: report.reportedAt }
  );

  const paddedNumber = String(sequentialNumber).padStart(4, "0");

  return {
    ...report,
    displayId: `${statusPrefix}${dateComponent}-${paddedNumber}`,
  };
}
