import { DETECTED_CATEGORIES } from "@/constants";
import { defineField, defineType } from "sanity";

export const suggestedTopicSchema = defineType({
  name: "suggestedTopic",
  title: "Suggested Topic",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedBy",
      title: "Submitted By",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "icon",
      title: "Topic Icon",
      type: "image",
      description: "A pixel art icon representing this topic (ideally square)",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error("Icon is required"),
    }),
    defineField({
      name: "banner",
      title: "Topic Banner",
      type: "image",
      description: "A wider banner image for the topic header",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error("Banner is required"),
    }),
    defineField({
      name: "aiModerationResult",
      type: "object",
      title: "AI Moderation Result",
      description:
        "AI analysis of whether this topic is suitable for pixel art social media",
      fields: [
        {
          name: "isApproved",
          type: "boolean",
          title: "AI Approved",
          description: "Whether AI considers this topic appropriate",
          initialValue: false,
        },
        {
          name: "suitabilityScore",
          type: "number",
          title: "Suitability Score",
          description: "How well this topic fits pixel art social media (0-1)",
          validation: (Rule) => Rule.min(0).max(1),
        },
        {
          name: "categories",
          type: "array",
          title: "Detected Categories",
          of: [
            {
              type: "string",
              options: {
                list: DETECTED_CATEGORIES,
              },
            },
          ],
        },
        {
          name: "reasons",
          type: "array",
          title: "Analysis Reasons",
          of: [{ type: "string" }],
          description: "Detailed reasons for AI's decision",
        },
        {
          name: "suggestions",
          type: "array",
          title: "AI Suggestions",
          of: [{ type: "string" }],
          description: "Suggestions to improve the topic if needed",
        },
        {
          name: "checkedAt",
          type: "datetime",
          title: "AI Check Date",
          description: "When the AI moderation was performed",
        },
      ],
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Moderation Status",
      options: {
        list: [
          { title: "Pending AI Review", value: "pending_ai" },
          { title: "AI Approved", value: "ai_approved" },
          { title: "AI Rejected", value: "ai_rejected" },
          { title: "Human Review Required", value: "needs_human_review" },
          { title: "Manually Approved", value: "manually_approved" },
          { title: "Rejected", value: "rejected" },
          { title: "Published", value: "published" },
        ],
      },
      initialValue: "pending_ai",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "icon",
      status: "status",
      suitability: "aiModerationResult.suitabilityScore",
    },
    prepare({
      title,
      media,
      status,
      suitability,
    }: {
      title: string;
      media: any;
      status:
        | "pending_ai"
        | "ai_approved"
        | "ai_rejected"
        | "needs_human_review"
        | "manually_approved"
        | "rejected"
        | "published";
      suitability?: number;
    }) {
      const statusEmoji =
        {
          pending_ai: "⏳",
          ai_approved: "✅",
          ai_rejected: "❌",
          needs_human_review: "👁️",
          manually_approved: "✅",
          rejected: "🚫",
          published: "🚀",
        }[status] || "❓";

      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `Status: ${status}${
          suitability ? ` (${Math.round(suitability * 100)}% suitable)` : ""
        }`,
        media,
      };
    },
  },
});
