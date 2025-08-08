import { Users, Activity, MessageSquare, Flag } from "lucide-react";
import MetricCard from "./metric-card";
import { getDashboardMetrics } from "@/sanity/lib/dashboard";

const MetricCards = async () => {
  const metrics = await getDashboardMetrics();

  const stats = {
    totalUsers: metrics.totalUsers,
    activeUsers24h: metrics.activeUsers24h,
    totalPosts: metrics.totalPosts,
    newPosts24h: metrics.newPosts24h,
    pendingReports: metrics.pendingReports,
    newReports24h: metrics.newReports24h,
    moderationStats: metrics.moderationStats,
    newUsers24h: metrics.newUsers24h,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Users"
        value={stats?.totalUsers || "N/A"}
        change={stats?.newUsers24h}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        href="/admin/users"
      />

      <MetricCard
        title="Active Users"
        value={stats?.activeUsers24h || "N/A"}
        subtext="in last 24h"
        icon={<Activity className="h-4 w-4 text-green-500" />}
      />

      <MetricCard
        title="Total Posts"
        value={stats?.totalPosts || "N/A"}
        change={stats?.newPosts24h}
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
        href="/admin/posts"
      />

      <MetricCard
        title="Pending Reports"
        value={stats?.pendingReports || "N/A"}
        change={stats?.newReports24h}
        icon={<Flag className="h-4 w-4 text-amber-500" />}
        href="/admin/reports"
      />
    </div>
  );
};

export default MetricCards;
