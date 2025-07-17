import TopicSuggestForm from "@/components/topic/topic-suggest-form";

export const generateMetadata = () => {
  return {
    title: "Suggest a New Topic",
    description:
      "Suggest a new topic for the PixelVerse community. Moderators will review your suggestion.",
    openGraph: {
      title: "Suggest a New Topic",
      description:
        "Suggest a new topic for the PixelVerse community. Moderators will review your suggestion.",
      url: "/topics/suggest",
    },
    twitter: {
      title: "Suggest a New Topic",
      description:
        "Suggest a new topic for the PixelVerse community. Moderators will review your suggestion.",
    },
  };
};

const SuggestTopicPage = () => {
  return (
    <section className="flex-center flex-col gap-3 px-0 py-6 md:p-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Suggest a New Topic</h1>
        <p className="text-muted-foreground">
          Suggest a new topic for the PixelVerse community. Moderators will
          review your suggestion.
        </p>
      </div>
      <div className="max-w-2xl w-full mx-auto">
        <TopicSuggestForm />
      </div>
    </section>
  );
};

export default SuggestTopicPage;
