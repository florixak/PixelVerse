"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient, client } from "@/sanity/lib/client";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { Notification } from "@/sanity.types";

export type NotificationResult<T> = {
  success: boolean;
  error?: string;
  data?: T;
  count?: number;
  action?: string;
};

export async function getNotifications(
  limit = 20
): Promise<NotificationResult<Notification[]>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const notifications = await client.fetch<Notification[]>(
      `*[_type == "notification" && recipient._ref == $userId] | order(createdAt desc) [0...$limit] {
        _id,
        type,
        message,
        isRead,
        createdAt,
        sender-> {
          _id,
          username,
          imageUrl
        },
        content-> {
          _id,
          _type,
          title,
          content
        }
      }`,
      { userId: currentUser._id, limit },
      { useCdn: false }
    );

    return { success: true, data: notifications || [] };
  } catch (error) {
    console.error("❌ Failed to get notifications:", error);
    return { success: false, error: "Failed to get notifications" };
  }
}

export async function getUnreadNotificationCount(): Promise<
  NotificationResult<number>
> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const count = await client.fetch<number>(
      `count(*[_type == "notification" && recipient._ref == $userId && isRead == false])`,
      { userId: currentUser._id },
      { useCdn: false }
    );

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("❌ Failed to get unread notification count:", error);
    return { success: false, error: "Failed to get unread notification count" };
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<NotificationResult<Notification>> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const notification = await client.fetch(
      `*[_type == "notification" && _id == $notificationId && recipient._ref == $userId][0]`,
      { notificationId, userId: currentUser._id },
      { useCdn: false }
    );

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    if (notification.isRead) {
      return { success: true, action: "already_read" };
    }

    await writeClient.patch(notificationId).set({ isRead: true }).commit();

    console.log(`✅ Marked notification as read: ${notificationId}`);

    return { success: true, action: "marked_read" };
  } catch (error) {
    console.error("❌ Failed to mark notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

// ✅ Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<
  NotificationResult<Notification[]>
> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await getUserByClerkId(clerkId);
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const unreadNotifications = await client.fetch(
      `*[_type == "notification" && recipient._ref == $userId && isRead == false] { _id }`,
      { userId: currentUser._id },
      { useCdn: false }
    );

    if (unreadNotifications.length === 0) {
      return { success: true, action: "no_unread", count: 0 };
    }

    const transaction = writeClient.transaction();
    unreadNotifications.forEach((notification: Notification) => {
      transaction.patch(notification._id, (patch) =>
        patch.set({ isRead: true })
      );
    });

    await transaction.commit();

    console.log(
      `✅ Marked ${unreadNotifications.length} notifications as read`
    );

    return {
      success: true,
      action: "marked_all_read",
      count: unreadNotifications.length,
    };
  } catch (error) {
    console.error("❌ Failed to mark all notifications as read:", error);
    return {
      success: false,
      error: "Failed to mark all notifications as read",
    };
  }
}

export async function createNotification({
  recipientId,
  senderId,
  type,
  message,
  contentId,
}: {
  recipientId: string;
  senderId: string;
  type: "follow" | "post_like" | "comment_like" | "comment" | "mention";
  message: string;
  contentId?: string;
}): Promise<NotificationResult<{ _id: string }>> {
  try {
    if (recipientId === senderId) {
      return { success: true, action: "skipped_self" };
    }

    const notification = await writeClient.create({
      _type: "notification",
      recipient: { _type: "reference", _ref: recipientId },
      sender: { _type: "reference", _ref: senderId },
      type,
      message,
      ...(contentId && { content: { _type: "reference", _ref: contentId } }),
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    console.log(
      `✅ Created notification: ${type} from ${senderId} to ${recipientId}`
    );

    return {
      success: true,
      action: "created",
      data: { _id: notification._id },
    };
  } catch (error) {
    console.error("❌ Failed to create notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function deleteNotification({
  recipientId,
  senderId,
  type,
  contentId,
}: {
  recipientId: string;
  senderId: string;
  type: string;
  contentId?: string;
}): Promise<NotificationResult<{ _id: string }>> {
  try {
    let query = `*[_type == "notification" && recipient._ref == $recipientId && sender._ref == $senderId && type == $type`;
    const params: any = { recipientId, senderId, type };

    if (contentId) {
      query += ` && content._ref == $contentId`;
      params.contentId = contentId;
    }

    query += `][0]`;

    const notification = await client.fetch(query, params, { useCdn: false });

    if (!notification) {
      return { success: true, action: "not_found" };
    }

    await writeClient.delete(notification._id);

    console.log(`✅ Deleted notification: ${notification._id}`);

    return { success: true, action: "deleted" };
  } catch (error) {
    console.error("❌ Failed to delete notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

export async function cleanupOldNotifications(
  daysOld = 30
): Promise<NotificationResult<{ _id: string }>> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffISOString = cutoffDate.toISOString();

    const oldNotifications = await client.fetch(
      `*[_type == "notification" && createdAt < $cutoffDate] { _id }`,
      { cutoffDate: cutoffISOString }
    );

    if (oldNotifications.length === 0) {
      return { success: true, action: "no_old_notifications", count: 0 };
    }

    const transaction = writeClient.transaction();
    oldNotifications.forEach((notification: any) => {
      transaction.delete(notification._id);
    });

    await transaction.commit();

    console.log(`✅ Cleaned up ${oldNotifications.length} old notifications`);

    return {
      success: true,
      action: "cleaned_up",
      count: oldNotifications.length,
    };
  } catch (error) {
    console.error("❌ Failed to cleanup old notifications:", error);
    return { success: false, error: "Failed to cleanup old notifications" };
  }
}
