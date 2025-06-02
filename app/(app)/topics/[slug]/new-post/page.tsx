import CreatePostForm from "@/components/post-form/create-post-form";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";

const PostCreatePage = async () => {
  const topics = await getAllTopics({});

  return <CreatePostForm topics={topics} />;
};

export default PostCreatePage;
