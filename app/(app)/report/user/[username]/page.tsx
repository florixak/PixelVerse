import ReportForm from "@/components/report/report-form";
import { getUserByUsername } from "@/sanity/lib/users/getUserByUsername";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

type PostReportPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const UserReportPage = async ({ params }: PostReportPageProps) => {
  const { username } = await params;
  if (!username) notFound();

  const [reportedUser, viewer] = await Promise.all([
    getUserByUsername(username),
    currentUser(),
  ]);

  if (!reportedUser) notFound();

  if (viewer && reportedUser.clerkId === viewer.id) {
    redirect(`/user/${username}`);
  }

  return <ReportForm content={reportedUser} contentType="user" />;
};

export default UserReportPage;
