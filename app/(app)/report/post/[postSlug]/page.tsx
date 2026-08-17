import ReportForm from "@/components/report/report-form";
import getPostBySlug from "@/sanity/lib/posts/getPostBySlug";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

type PostReportPageProps = {
  params: Promise<{
    postSlug: string;
  }>;
};

const PostReportPage = async ({ params }: PostReportPageProps) => {
  const { postSlug } = await params;
  if (!postSlug) notFound();

  const [post, viewer] = await Promise.all([
    getPostBySlug(postSlug),
    currentUser(),
  ]);

  if (!post) notFound();

  if (viewer && post.author?.clerkId === viewer.id) {
    redirect(`/topics/${post.topicSlug}/${post.slug}`);
  }

  return <ReportForm content={post} contentType="post" />;
};

export default PostReportPage;
