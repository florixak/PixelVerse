import AdminReportsClient from "@/components/admin/admin-reports-client";
import { getAllReports } from "@/sanity/lib/reports/getAllReports";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const MyReportsPage = async () => {
  const user = await currentUser();
  const reports = await getAllReports();
  if (!user) {
    notFound();
  }
  return <AdminReportsClient initialReports={reports} />;
};

export default MyReportsPage;
