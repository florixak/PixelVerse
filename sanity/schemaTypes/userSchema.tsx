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
