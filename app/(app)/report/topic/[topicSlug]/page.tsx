import ReportForm from "@/components/report-form";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import { notFound } from "next/navigation";

type TopicReportPageProps = {
  params: Promise<{
    topicSlug: string;
  }>;
};

const TopicReportPage = async ({ params }: TopicReportPageProps) => {
  const { topicSlug } = await params;
  if (!topicSlug) {
    notFound();
  }
  const topic = await getTopicBySlug(topicSlug);

  if (!topic) {
    notFound();
  }

  return (
    <ReportForm
      content={topic}
      contentType="topic"
      returnUrl={`/topics/${topicSlug}
      `}
    />
  );
};

export default TopicReportPage;
