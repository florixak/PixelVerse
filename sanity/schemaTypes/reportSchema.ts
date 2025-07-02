import { REPORT_REASONS } from "@/constants";
import { defineField, defineType } from "sanity";

export const reportSchema = defineType({
  name: "report",
  title: "Report",
  type: "document",
  fields: [
    defineField({
      name: "displayId",
      type: "string",
      title: "Display ID",
      description: "Unique identifier for the report (e.g., REP-0001)",
      readOnly: true,
    }),
    defineField({
      name: "contentType",
      type: "string",
      title: "Content Type",
      description: "Type of content being reported",
      options: {
        list: [
          { title: "Post", value: "post" },
          { title: "Comment", value: "comment" },
          { title: "User", value: "user" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      type: "reference",
      title: "Reported Content",
      description: "Reference to the content being reported",
      to: [{ type: "post" }, { type: "comment" }, { type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reporter",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reason",
      type: "string",
      title: "Reason for Reporting",
      description: "Please provide a reason for reporting this content.",
      options: {
        list: REPORT_REASONS.map(({ label, value }) => ({
          title: label,
          value,
        })),
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Reason is required"),
    }),
    // Rest of your fields remain the same
    defineField({
      name: "additionalInfo",
      type: "text",
      title: "Additional Information",
      description: "Any additional information you would like to provide.",
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: "reportedAt",
      type: "datetime",
      title: "Reported At",
      description: "The date and time when the content was reported.",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      description: "Current status of the report (e.g., pending, resolved).",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Resolved", value: "resolved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: () => "pending",
    }),
    defineField({
      name: "moderatedBy",
      type: "reference",
      to: [{ type: "user" }],
      title: "Moderated By",
      description: "User who handled the report.",
      readOnly: true,
    }),
    defineField({
      name: "moderationNotes",
      type: "text",
      title: "Moderation Notes",
      description: "Notes from the moderator regarding the report.",
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: "moderatedAt",
      type: "datetime",
      title: "Moderated At",
      description: "The date and time when the report was moderated.",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      contentType: "contentType",
      postTitle: "content.title",
      commentContent: "content.content",
      username: "content.username",
      reporterName: "reporter.username",
      reason: "reason",
      displayId: "displayId",
    },
    prepare({
      contentType,
      postTitle,
      commentContent,
      username,
      reporterName,
      reason,
      displayId,
    }) {
      let title = displayId || "Report";

      if (contentType === "post" && postTitle) {
        title += ` - Post: ${postTitle}`;
      } else if (contentType === "comment" && commentContent) {
        const previewContent =
          commentContent.substring(0, 30) +
          (commentContent.length > 30 ? "..." : "");
        title += ` - Comment: ${previewContent}`;
      } else if (contentType === "user" && username) {
        title += ` - User: ${username}`;
      }

      return {
        title,
        subtitle: `Reported by ${reporterName || "Unknown"} for ${reason}`,
      };
    },
  },
});
