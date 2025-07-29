import { REACTIONS } from "@/constants";
import { defineType, defineField } from "sanity";

export const reactionSchema = defineType({
  name: "reaction",
  type: "document",
  title: "Reaction",
  description:
    "User reactions to posts or comments, such as likes or dislikes.",
  fields: [
    defineField({
      name: "content",
      type: "reference",
      title: "Reported Content",
      description: "Reference to the content being reported",
      to: [{ type: "post" }, { type: "comment" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Reaction Type",
      type: "string",
      options: {
        list: REACTIONS,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      type: "type",
      userName: "user.username",
      content: "content.title",
      commentContent: "comment.content",
    },
    prepare(selection) {
      const { type, userName, content, commentContent } = selection;
      const target = content || commentContent?.substring(0, 30) + "...";
      const media =
        type === "like"
          ? "Like"
          : type === "dislike"
          ? "Dislike"
          : type === "love"
          ? "Love"
          : "Helpful";

      return {
        title: `${media} by ${userName}`,
        subtitle: `on ${target}`,
        media,
      };
    },
  },
});
