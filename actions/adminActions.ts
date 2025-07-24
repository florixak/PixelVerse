"use server";

import { checkAdminAuth, isUserAdmin } from "@/lib/user-utils";
import { Report, User } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { auth } from "@clerk/nextjs/server";
import { groq } from "next-sanity";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (
  userId: User["_id"],
  newRole: User["role"]
): Promise<{
  success: boolean;
  user?: User | null;
  message?: string;
}> => {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    const canUpdateRole = await isUserAdmin(currentUserId);
    if (!canUpdateRole) {
      return {
        success: false,
        message: "You do not have permission to update user roles.",
      };
    }

    if (!userId || !newRole) {
      return {
        success: false,
        message: "User ID and new role are required.",
      };
    }

    const updatedUser = await writeClient
      .patch(userId)
      .set({ role: newRole })
      .commit();

    revalidatePath("/admin/users");

    return {
      success: true,
      user: updatedUser as User,
      message: `User role updated to ${newRole}.`,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error(
      `Failed to update user role: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteUser = async (
  userId: User["_id"]
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required.",
      };
    }
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }
    const currentUser = await getUserByClerkId(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: true,
        message: "User removal functionality is not implemented yet.",
      };
    }

    const removedUser = await writeClient.delete(userId);
    revalidatePath("/admin/users");
    if (!removedUser) {
      return {
        success: false,
        message: "Failed to remove user. User not found or already deleted.",
      };
    }

    return {
      success: true,
      message: `User with ID ${userId} has been successfully removed.`,
    };
  } catch (error) {
    console.error("Error removing user:", error);
    return {
      success: false,
      message: `Failed to remove user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

export type ReportAction = "resolved" | "rejected" | null;

export const handleReportAction = async (
  reportId: Report["_id"],
  action: ReportAction,
  resolveMessage?: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const { user, isAuthorized, error } = await checkAdminAuth();

    if (!isAuthorized) {
      return {
        success: false,
        message: error,
      };
    }

    if (!reportId || !action) {
      return {
        success: false,
        message: "Report ID and action are required.",
      };
    }

    const queryReport: {
      _id: Report["_id"];
      reportedContent?: {
        _id: string;
        _type: string;
        reportCount?: number;
      } | null;
    } = await writeClient.fetch(
      groq`
  *[_type == "report" && _id == $reportId][0]{
    _id,
    "reportedContent": content->{
      _id,
      _type,
      reportCount
    }
  }
`,
      { reportId }
    );

    if (!queryReport) {
      return {
        success: false,
        message: "Report not found.",
      };
    }

    const reportedContent = queryReport.reportedContent;

    if (!reportedContent || !reportedContent._id) {
      return {
        success: false,
        message: "Reported content not found or reference is broken.",
      };
    }

    if (action === "rejected") {
      await writeClient
        .patch(reportedContent?._id)
        .setIfMissing({ reportCount: 0 })
        .set({ reportCount: 0 })
        .commit();
    } else if (action === "resolved") {
      await writeClient
        .patch(reportedContent?._id)
        .setIfMissing({ isBanned: false })
        .set({
          reportCount: 0,
          isBanned: true,
          bannedBy: { _type: "reference", _ref: user?._id },
          bannedAt: new Date().toISOString(),
          bannedReason: resolveMessage || "Content banned by admin",
        })
        .commit();
    }

    const report = await writeClient
      .patch(reportId)
      .set({
        status: action,
        moderatedBy: {
          _type: "reference",
          _ref: user?._id,
        },
        moderationNotes: resolveMessage || "",
        moderatedAt: new Date().toISOString(),
      })
      .commit();

    revalidatePath("/admin/reports");
    revalidatePath(`/admin/reports/${reportId}`);

    return {
      success: true,
      message: `Report ${action}d successfully.`,
    };
  } catch (error) {
    console.error("Error handling report action:", error);
    return {
      success: false,
      message: `Failed to handle report action: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
