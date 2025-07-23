import ReportDetails from "@/components/report-details";
import AdminReportForm from "@/components/admin/admin-report-form";
import { Report } from "@/sanity.types";
import { getReportById } from "@/sanity/lib/reports/getReportById";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type MyReportDetailsPageProps = {
  params: Promise<{ id: Report["_id"] }>;
};

const MyReportDetails = async ({ params }: MyReportDetailsPageProps) => {
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
    <section className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-6">
      <ReportDetails report={report} />
    </section>
  );
};

export default MyReportDetails;
