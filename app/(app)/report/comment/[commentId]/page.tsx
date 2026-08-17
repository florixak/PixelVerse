import ReportForm from "@/components/report/report-form";
import { getCommentById } from "@/sanity/lib/posts/getCommentById";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

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
  const [comment, viewer] = await Promise.all([
    getCommentById(commentId),
    currentUser(),
  ]);

  if (!comment || !comment.post) notFound();

  if (viewer && comment.author?.clerkId === viewer.id) {
    redirect(
      `/topics/${comment.post.topicSlug}/${comment.post.slug}#comment-${comment._id}`,
    );
  }

  return <ReportForm content={comment} contentType="comment" />;
};

export default CommentReportPage;
