import UserReportsClient from "@/components/user/user-reports-client";
import { getUserReports } from "@/sanity/lib/reports/getUserReports";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const MyReportsPage = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    notFound();
  }
  const reports = await getUserReports(user.id);

  return <UserReportsClient initialReports={reports} />;
};

export default MyReportsPage;
