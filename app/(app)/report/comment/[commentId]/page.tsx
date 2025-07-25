import ReportForm from "@/components/report-form";
import { getCommentById } from "@/sanity/lib/posts/getCommentById";
import { notFound } from "next/navigation";

type CommentReportPageProps = {
  params: Promise<{
    commentId: string;
  }>;
};

const CommentReportPage = async ({ params }: CommentReportPageProps) => {
  const { commentId } = await params;
  if (!commentId) {
    notFound();
  }
  const comment = await getCommentById(commentId);
  if (!comment || !comment.post) {
    notFound();
  }

  return <ReportForm content={comment} contentType="comment" />;
};

export default CommentReportPage;
