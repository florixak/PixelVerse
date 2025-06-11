import AdminReportDetails from "@/components/admin/admin-report-details";
import AdminReportForm from "@/components/admin/admin-report-form";
import { Report } from "@/sanity.types";
import { getReportById } from "@/sanity/lib/reports/getReportById";
import { notFound } from "next/navigation";

type ReportDetailsPageProps = {
  params: Promise<{ id: Report["_id"] }>;
};

const ReportDetailsPage = async ({ params }: ReportDetailsPageProps) => {
  const { id } = await params;
  const report: Report | null = await getReportById(id);
  if (!report) {
    notFound();
  }
  return (
    <section className="flex flex-col gap-8 w-full max-w-4xl mx-auto p-6">
      <AdminReportDetails report={report} />
      <AdminReportForm report={report} />
    </section>
  );
};

export default ReportDetailsPage;
