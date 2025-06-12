import ReportForm from "@/components/post/report-form";
import getPostBySlug from "@/sanity/lib/posts/getPostBySlug";
import { notFound } from "next/navigation";

type PostReportPageProps = {
  params: Promise<{
    postSlug: string;
  }>;
};

const PostReportPage = async ({ params }: PostReportPageProps) => {
  const { postSlug } = await params;
  if (!postSlug) {
    notFound();
  }
  const post = await getPostBySlug(postSlug);
  return (
    <ReportForm
      post={post}
      contentType="post"
      returnUrl={`/topics/${post.topicSlug}`}
    />
  );
};

export default PostReportPage;
