import { getRecentReports } from "@/sanity/lib/dashboard";
import CompactReportCard from "./compact-report-card";

const RecentReports = async () => {
  const reports = await getRecentReports();

  return (
    <div className="space-y-2">
      {reports.map((report) => (
        <CompactReportCard key={report._id} report={report} />
      ))}
    </div>
  );
};

export default RecentReports;
