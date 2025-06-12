import { getDashboardStats } from "@/actions/adminActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Activity, Users, Flag, MessageSquare } from "lucide-react";
import Link from "next/link";

const AdminDashboard = async () => {
  const stats = await getDashboardStats();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={stats?.totalUsers}
          change={stats?.newUsers24h}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          href="/admin/users"
        />

        <MetricCard
          title="Active Users"
          value={stats?.activeUsers24h}
          subtext="in last 24h"
          icon={<Activity className="h-4 w-4 text-green-500" />}
        />

        <MetricCard
          title="Total Posts"
          value={stats?.totalPosts}
          change={stats?.newPosts24h}
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          href="/admin/posts"
        />

        <MetricCard
          title="Pending Reports"
          value={stats?.pendingReports}
          change={stats?.newReports24h}
          icon={<Flag className="h-4 w-4 text-amber-500" />}
          href="/admin/reports"
        />
      </div>

      {/* Recent Items Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Recent Reports</span>
              <Link
                href="/admin/reports"
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </CardTitle>
            <CardDescription>Reports requiring moderation</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>New Users</span>
              <Link
                href="/admin/users"
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </CardTitle>
            <CardDescription>Recently joined users</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>
              Most active topics in the past week
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Stats</CardTitle>
            <CardDescription>Report handling metrics</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
};

type MetricCardProps = {
  title: string;
  value: string | number;
  change?: string | number;
  subtext?: string;
  icon: React.ReactNode;
  href?: string;
};

const MetricCard = ({
  title,
  value,
  change,
  subtext,
  icon,
  href,
}: MetricCardProps) => (
  <Card
    className={`${href ? "transition-all hover:border-primary/50" : ""} ${
      href ? "relative" : ""
    }`}
    key={title}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
      {change && (
        <p className="text-sm text-green-500">+{change} in the last 24 hours</p>
      )}
    </CardContent>
    {href && (
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`View ${title}`}
      />
    )}
  </Card>
);

export default AdminDashboard;
