import TopicSuggestForm from "@/components/topic/topic-suggest-form";

const SUGGEST_DESCRIPTION =
  "Suggest a new topic for the PixelVerse community. Suggestions are checked automatically and may go live, be declined, or wait for a moderator.";

export const generateMetadata = () => {
  return {
    title: "Suggest a New Topic",
    description: SUGGEST_DESCRIPTION,
    openGraph: {
      title: "Suggest a New Topic",
      description: SUGGEST_DESCRIPTION,
      url: "/topics/suggest",
    },
    twitter: {
      title: "Suggest a New Topic",
      description: SUGGEST_DESCRIPTION,
    },
  };
};

const SuggestTopicPage = () => {
  return (
    <section className="flex-center flex-col gap-3 px-0 py-6 md:p-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Suggest a New Topic</h1>
        <p className="text-muted-foreground">{SUGGEST_DESCRIPTION}</p>
      </div>
      <div className="max-w-2xl w-full mx-auto">
        <TopicSuggestForm />
      </div>
    </section>
  );
};

export default SuggestTopicPage;
