import { REPORT_REASONS } from "@/lib/constants";
import { defineField, defineType } from "sanity";

export const reportSchema = defineType({
  name: "report",
  title: "Report",
  type: "document",
  fields: [
    defineField({
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
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
      description: "Please provide a reason for reporting this post.",
      options: {
        list: REPORT_REASONS.map(({ label, value }) => ({
          title: label,
          value,
        })),
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required().error("Reason is required"),
    }),
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
      description: "The date and time when the post was reported.",
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
      initialValue: "pending",
    }),
  ],
  preview: {
    select: {
      title: "post.title",
      reporterName: "reporter.username",
      reason: "reason",
    },
    prepare({ title, reporterName, reason }) {
      return {
        title,
        subtitle: `Reported by ${reporterName} for ${reason}`,
      };
    },
  },
});
