import { POST_TYPES, SOFTWARE_OPTIONS, DIFFICULTY_LEVELS } from "@/constants";
import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Post",
  type: "document",
  description: "A blog post or tutorial related to pixel art",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (slug, context) => context.defaultIsUnique(slug, context),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary that appears in feed",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "user" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "reference",
      to: { type: "topic" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      readOnly: true,
    }),
    // Pixel Art Specific Fields
    defineField({
      name: "postType",
      title: "Post Type",
      type: "string",
      options: {
        list: POST_TYPES,
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Pixel Art Image",
      type: "image",
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" &&
        document?.postType !== "animation" &&
        document?.postType !== "tutorfial",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions (pixels)",
      type: "string",
      placeholder: "32x32",
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" && document?.postType !== "animation",
    }),
    defineField({
      name: "software",
      title: "Software Used",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: SOFTWARE_OPTIONS,
      },
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" &&
        document?.postType !== "animation" &&
        document?.postType !== "tutorial",
    }),

    defineField({
      name: "colorPalette",
      title: "Color Palette",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "hex", type: "string", title: "Hex Code" },
            { name: "name", type: "string", title: "Color Name" },
          ],
        },
      ],
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" && document?.postType !== "animation",
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty Level",
      type: "string",
      options: {
        list: DIFFICULTY_LEVELS,
      },
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" &&
        document?.postType !== "animation" &&
        document?.postType !== "tutorial",
    }),
    defineField({
      name: "timeSpent",
      title: "Time Spent (hours)",
      type: "number",
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" && document?.postType !== "animation",
    }),
    defineField({
      name: "tutorialSteps",
      title: "Tutorial Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Step Title" },
            { name: "description", type: "text", title: "Description" },
            { name: "imageUrl", type: "url", title: "Step Image URL" },
          ],
        },
      ],
      hidden: ({ document }) => document?.postType !== "tutorial",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isOriginal",
      title: "Original Creation",
      type: "boolean",
      description: "Is this pixel art an original creation?",
      initialValue: true,
      hidden: ({ document }) =>
        document?.postType !== "pixelArt" && document?.postType !== "animation",
    }),
    defineField({
      name: "inspirationSource",
      title: "Inspiration Source",
      type: "string",
      hidden: ({ document }) => document?.isOriginal !== false,
    }),
    defineField({
      name: "isDeleted",
      title: "Is Deleted",
      type: "boolean",
      initialValue: false,
      description: "If true, this post is hidden from users but not deleted.",
    }),
    defineField({
      name: "disabledComments",
      title: "Disable Comments",
      type: "boolean",
      initialValue: false,
      description: "If true, comments are disabled for this post.",
    }),
    defineField({
      name: "reactions",
      title: "Reactions",
      type: "array",
      of: [{ type: "reaction" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "reportCount",
      title: "Report Count",
      type: "number",
      initialValue: 2,
      readOnly: true,
      description:
        "Number of reports against this post (cached for performance)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
