import { defineType, defineField } from "sanity";

export const notificationSchema = defineType({
  name: "notification",
  type: "document",
  title: "Notification",
  description: "User notifications for follows, likes, comments, etc.",
  fields: [
    defineField({
      name: "recipient",
      type: "reference",
      title: "Recipient",
      description: "The user who receives this notification",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sender",
      type: "reference",
      title: "Sender",
      description: "The user who triggered this notification",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Notification Type",
      options: {
        list: [
          { title: "New Follower", value: "follow" },
          { title: "Post Liked", value: "post_like" },
          { title: "Comment Liked", value: "comment_like" },
          { title: "New Comment", value: "comment" },
          { title: "Mentioned in Post", value: "mention" },
          { title: "Post Shared", value: "share" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      type: "string",
      title: "Message",
      description: "The notification message text",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "content",
      type: "reference",
      title: "Related Content",
      description:
        "Post, comment, follow, or other content this notification relates to",
      to: [
        { type: "post" },
        { type: "comment" },
        { type: "follow" },
        { type: "reaction" },
      ],
      // Optional - some notifications might not have related content
    }),
    defineField({
      name: "isRead",
      type: "boolean",
      title: "Is Read",
      description: "Whether the recipient has read this notification",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "readAt",
      type: "datetime",
      title: "Read At",
      description: "When the notification was marked as read",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Created At (Newest First)",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Unread First",
      name: "unreadFirst",
      by: [
        { field: "isRead", direction: "asc" },
        { field: "createdAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      senderName: "sender.username",
      senderImage: "sender.imageUrl",
      recipientName: "recipient.username",
      type: "type",
      message: "message",
      isRead: "isRead",
      createdAt: "createdAt",
    },
    prepare({ senderName, recipientName, type, message, isRead, createdAt }) {
      const typeIcons = {
        follow: "👥",
        post_like: "❤️",
        comment_like: "👍",
        comment: "💬",
        mention: "📢",
        share: "🔄",
      };

      return {
        title: `${
          typeIcons[type as keyof typeof typeIcons] || "🔔"
        } ${senderName} → ${recipientName}`,
        subtitle: `${message} • ${new Date(createdAt).toLocaleDateString()} ${
          !isRead ? "• Unread" : ""
        }`,
      };
    },
  },
  initialValue: {
    isRead: false,
    createdAt: () => new Date().toISOString(),
  },
});
