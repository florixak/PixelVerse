import { canAccessDashboard } from "@/lib/user-utils";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "../users/getUserByClerkId";
import { getPostStats } from "./getPostStats";
import { getReportStats } from "./getReportStats";
import { getUserStats } from "./getUserStats";
import { notFound } from "next/navigation";

export const getDashboardMetrics = async () => {
  try {
    const user = await currentUser();
    if (!user) return {};

    const sanityUser = await getUserByClerkId(user.id);
    if (!sanityUser) {
      return {};
    }
    const canAccess = await canAccessDashboard(sanityUser?.clerkId);
    if (!canAccess) {
      return {};
    }

    const [userStats, postStats, reportStats] = await Promise.all([
      getUserStats(),
      getPostStats(),
      getReportStats(),
    ]);

    return {
      totalUsers: userStats.total,
      newUsers24h: userStats.new24h,
      activeUsers24h: userStats.active24h,
      totalPosts: postStats.total,
      newPosts24h: postStats.new24h,
      pendingReports: reportStats.pending,
      newReports24h: reportStats.new24h,
      moderationStats: reportStats.moderationMetrics,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
