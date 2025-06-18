import CreatePostForm from "@/components/post/post-form/create-post-form";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";

type CreatePostPageProps = {
  searchParams: Promise<{
    topic: string;
  }>;
};

const CreatePostPage = async ({ searchParams }: CreatePostPageProps) => {
  const { topic: topicSlug } = await searchParams;
  const topics = await getAllTopics({});
  const topic = await getTopicBySlug(decodeURIComponent(topicSlug));

  return (
    <section className="flex-center flex-col gap-3 px-0 py-6 md:p-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create a New Post</h1>
        <p className="text-muted-foreground">
          Share your pixel art, tutorial, or question with the community
        </p>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <CreatePostForm topics={topics} topic={topic} />
      </div>
    </section>
  );
};

export default CreatePostPage;
