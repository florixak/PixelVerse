import AdminReportsClient from "@/components/admin/admin-reports-client";
import getAllReports from "@/sanity/lib/reports/getAllReports";
import { getUserByClerkId } from "@/sanity/lib/users/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";

const ReportsPage = async () => {
  const user = await currentUser();
  const reports = await getAllReports(user?.id, 50);
  if (!user) {
    return <div>You must be logged in to view this page.</div>;
  }
  const sanityUser = await getUserByClerkId(user.id);
  return <AdminReportsClient initialReports={reports} user={sanityUser} />;
};

export default ReportsPage;
