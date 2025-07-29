import { defineField, defineType } from "sanity";

export const commentSchema = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: { type: "post" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "user" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "parentComment",
      title: "Parent Comment",
      type: "reference",
      to: { type: "comment" },
      description: "If this is a reply, reference the parent comment",
    }),
    defineField({
      name: "isEdited",
      title: "Is Edited",
      type: "boolean",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "lastEditedAt",
      title: "Last Edited At",
      type: "datetime",
    }),
    defineField({
      name: "pixelArtUrl",
      title: "Pixel Art URL",
      type: "url",
      description:
        "External URL to pixel art image (use instead of upload if image is already hosted elsewhere)",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "isDeleted",
      title: "Is Deleted",
      type: "boolean",
      initialValue: false,
      description:
        "Flag to mark if comment was deleted but kept for thread continuity",
    }),
    defineField({
      name: "reportCount",
      title: "Report Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description:
        "Number of reports against this comment (cached for performance)",
    }),
    defineField({
      name: "isBanned",
      title: "Is Banned",
      type: "boolean",
      initialValue: false,
      readOnly: true,
      description:
        "If true, this comment is banned and will not be shown to users.",
    }),
    defineField({
      name: "bannedBy",
      title: "Banned By",
      type: "reference",
      to: { type: "user" },
      readOnly: true,
      description: "User who banned this comment",
      hidden: ({ document }) => !document?.isBanned,
    }),
    defineField({
      name: "bannedReason",
      title: "Banned Reason",
      type: "string",
      initialValue: "",
      readOnly: true,
      description: "Reason for banning this comment, set by the admin",
      hidden: ({ document }) => !document?.isBanned,
    }),
    defineField({
      name: "bannedAt",
      title: "Banned At",
      type: "datetime",
      readOnly: true,
      description: "Date when this comment was banned",
      hidden: ({ document }) => !document?.isBanned,
    }),
  ],
  preview: {
    select: {
      title: "content",
      author: "author.name",
      post: "post.title",
      media: "pixelArtAttachment",
    },
    prepare(selection) {
      const { title, author, post } = selection;
      return {
        title: title.substring(0, 50) + (title.length > 50 ? "..." : ""),
        subtitle: `${author ? `by ${author}` : ""} ${post ? `on ${post}` : ""}`,
        media: selection.media,
      };
    },
  },
});
