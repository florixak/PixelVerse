import { groq } from "next-sanity";
import { client } from "../client";
import { Report } from "@/sanity.types";

type ReportStats = {
  pending: number;
  new24h: number;
  moderationMetrics: {
    resolved24h: number;
    rejected24h: number;
    avgResolutionTime: string;
  };
};

export async function getReportStats(): Promise<ReportStats> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISOString = yesterday.toISOString();

  const stats = await client.fetch(
    groq`{
      "pending": count(*[_type == "report" && status == "pending"]),
      "new24h": count(*[_type == "report" && reportedAt > $yesterday]),
      "resolved24h": count(*[_type == "report" && status == "resolved" && moderatedAt > $yesterday]),
      "rejected24h": count(*[_type == "report" && status == "rejected" && moderatedAt > $yesterday])
    }`,
    { yesterday: yesterdayISOString }
  );

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentResolvedReports = await client.fetch<Report[]>(
    groq`*[_type == "report" && status == "resolved" && moderatedAt > $thirtyDaysAgo] {
      reportedAt,
      moderatedAt
    }`,
    { thirtyDaysAgo: thirtyDaysAgo.toISOString() }
  );

  let avgResolutionTime = 0;
  if (recentResolvedReports.length > 0) {
    const totalTime = recentResolvedReports.reduce((sum, report) => {
      const reportedAt = new Date(report.reportedAt);
      const moderatedAt = new Date(report.moderatedAt || report._updatedAt);
      return sum + (moderatedAt.getTime() - reportedAt.getTime());
    }, 0);

    avgResolutionTime =
      totalTime / recentResolvedReports.length / (1000 * 60 * 60);
  }

  return {
    pending: stats.pending,
    new24h: stats.new24h,
    moderationMetrics: {
      resolved24h: stats.resolved24h || 0,
      rejected24h: stats.rejected24h || 0,
      avgResolutionTime: avgResolutionTime.toFixed(1),
    },
  };
}
