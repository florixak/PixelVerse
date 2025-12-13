import ReportDetails from "@/components/report/report-details";
import AdminReportForm from "@/components/admin/admin-report-form";
import { Report } from "@/sanity.types";
import { getReportById } from "@/sanity/lib/reports/getReportById";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import BackButton from "@/components/back-button";

type ReportDetailsPageProps = {
  params: Promise<{ id: Report["_id"] }>;
};

const ReportDetailsPage = async ({ params }: ReportDetailsPageProps) => {
  const { id } = await params;
  const report: Report | null = await getReportById(id);
  if (!report) {
    notFound();
  }
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }
  return (
    <section className="relative flex flex-col gap-8 w-full max-w-4xl mx-auto p-6">
      <BackButton className="absolute top-6 -left-18" />
      <ReportDetails report={report} />
      <AdminReportForm report={report} userId={userId} />
    </section>
  );
};

export default ReportDetailsPage;
