import { UserIcon } from "lucide-react";
import Image from "next/image";
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
      validation: (Rule) =>
        Rule.uri({
          scheme: ["https"],
        }),
    }),
  ],
  preview: {
    select: {
      title: "username",
      media: "imageUrl",
    },
    prepare({ title, media }) {
      return {
        title,
        media: media ? (
          <Image
            src={media}
            alt={`User avatar for ${title}`}
            width={40}
            height={40}
          />
        ) : (
          <UserIcon />
        ),
      };
    },
  },
});
