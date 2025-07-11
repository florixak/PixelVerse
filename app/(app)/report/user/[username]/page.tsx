import ReportForm from "@/components/report-form";
import { getUserByUsername } from "@/sanity/lib/users/getUserByUsername";
import { notFound } from "next/navigation";

type PostReportPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const UserReportPage = async ({ params }: PostReportPageProps) => {
  const { username } = await params;
  if (!username) {
    notFound();
  }
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <ReportForm
      content={user}
      contentType="user"
      returnUrl={`/user/${user.username}`}
    />
  );
};

export default UserReportPage;
