import { defineType, defineField } from "sanity";

export const followSchema = defineType({
  name: "follow",
  type: "document",
  title: "Follow",
  description: "User follow relationships",
  fields: [
    defineField({
      name: "follower",
      type: "reference",
      title: "Follower",
      description: "The user who is following",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "following",
      type: "reference",
      title: "Following",
      description: "The user being followed",
      to: [{ type: "user" }],
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
  validation: (Rule) =>
    Rule.custom((fields) => {
      if (!fields?.follower || !fields?.following) {
        return "Both follower and following must be specified";
      }
      if (fields.follower === fields.following) {
        return "User cannot follow themselves";
      }
      return true;
    }),
  preview: {
    select: {
      followerName: "follower.username",
      followingName: "following.username",
      createdAt: "createdAt",
    },
    prepare({ followerName, followingName, createdAt }) {
      return {
        title: `${followerName} → ${followingName}`,
        subtitle: new Date(createdAt).toLocaleDateString(),
      };
    },
  },
});
