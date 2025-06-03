import { defineType, defineField } from "sanity";

export const reactionSchema = defineType({
  name: "reaction",
  type: "object",
  title: "Reaction",
  description:
    "User reactions to posts or comments, such as likes or dislikes.",
  icon: () => "👍",
  fields: [
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      type: "string",
      options: { list: ["like", "dislike"] },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
