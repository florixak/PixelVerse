import CreatePostForm from "@/components/post-form/create-post-form";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";

type PostCreatePageProps = {
  params: Promise<{ slug: string }>;
};

const PostCreatePage = async ({ params }: PostCreatePageProps) => {
  const topics = await getAllTopics({});
  if (!topics || topics.length === 0) {
    return <p>No topics available. Please create a topic first.</p>;
  }

  const { slug } = await params;

  return <CreatePostForm topics={topics} topicSlug={slug} />;
};

export default PostCreatePage;
