import AdminReportsClient from "@/components/admin/admin-reports-client";
import { getAllReports } from "@/sanity/lib/reports/getAllReports";
import { currentUser } from "@clerk/nextjs/server";

const ReportsPage = async () => {
  const user = await currentUser();
  const reports = await getAllReports();
  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }
  return <AdminReportsClient initialReports={reports} />;
};

export default ReportsPage;
