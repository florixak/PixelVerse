import { defineType, defineField } from "sanity";

export const userSchema = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      description: "The user's full name, if available.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "A short biography or description of the user.",
      rows: 3,
      validation: (Rule) => Rule.max(200).warning("Keep it concise!"),
    }),
    defineField({
      name: "createdAt",
      title: "Date Joined",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "isReported",
      title: "Is Reported",
      type: "boolean",
      initialValue: false,
      description:
        "Indicates if the user has been reported for inappropriate content.",
    }),
    defineField({
      name: "isBanned",
      title: "Is Banned",
      type: "boolean",
      initialValue: false,
      description: "Indicates if the user is banned from the platform.",
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL",
      type: "url",
      description: "URL of the user's profile image",
    }),
    defineField({
      name: "favoriteTopics",
      title: "Favorite Topics",
      type: "array",
      of: [{ type: "reference", to: { type: "topic" } }],
    }),
    defineField({
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      description:
        "Unique identifier for the user from Clerk, used for authentication.",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "role",
      title: "User Role",
      type: "string",
      options: {
        list: [
          { title: "User", value: "user" },
          { title: "Moderator", value: "moderator" },
          { title: "Admin", value: "admin" },
        ],
        layout: "radio",
      },
      initialValue: "user",
      validation: (Rule) => Rule.required(),
      description: "Determines user permissions within the platform",
    }),
    defineField({
      name: "followers",
      title: "Followers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "user" }] }],
      description: "Users who follow this user",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "following",
      title: "Following",
      type: "array",
      of: [{ type: "reference", to: [{ type: "user" }] }],
      description: "Users this user follows",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "followerCount",
      title: "Follower Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Number of followers (cached for performance)",
    }),
    defineField({
      name: "followingCount",
      title: "Following Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Number of users being followed (cached for performance)",
    }),
    defineField({
      name: "reportCount",
      title: "Report Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description:
        "Number of reports against this user (cached for performance)",
    }),
  ],
  preview: {
    select: {
      title: "username",
      media: "imageUrl",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title || "Unnamed User",
        // Create a proper media object for external URLs
        media: media ? (
          <img src={media} alt={title} style={{ objectFit: "cover" }} />
        ) : null,
      };
    },
  },
});
