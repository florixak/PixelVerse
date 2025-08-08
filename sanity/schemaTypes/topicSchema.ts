import { defineField, defineType } from "sanity";

export const topicSchema = defineType({
  name: "topic",
  title: "Topic",
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
      description: "A wider banner image for the topic header (optional)",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error("Banner is required"),
    }),
    defineField({
      name: "reportCount",
      title: "Report Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description:
        "Number of reports against this topic (cached for performance)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "icon",
    },
  },
});
