import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Suspense } from "react";
import MetricCards from "./dashboard/metric-cards";
import NewUsers from "./dashboard/new-users";
import RecentReports from "./dashboard/recent-reports";
import TrendingTopics from "./dashboard/trending-topics";

const AdminDashboard = async () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Key Metrics Cards */}
      <Suspense fallback={<div className="h-16">Loading metrics...</div>}>
        <MetricCards />
      </Suspense>

      {/* Recent Activity Section */}

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
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <RecentReports />
            </Suspense>
          </CardContent>
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
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <NewUsers />
            </Suspense>
          </CardContent>
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
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <TrendingTopics />
            </Suspense>
          </CardContent>
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

export default AdminDashboard;
