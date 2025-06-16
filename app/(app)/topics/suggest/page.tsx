import TopicSuggestForm from "@/components/topic/topic-suggest-form";

const SuggestTopicPage = () => {
  return (
    <section className="flex-center flex-col p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold">Suggest a New Topic</h1>
      <p className="text-muted-foreground">
        Suggest a new topic for the PixelVerse community. Moderators will review
        your suggestion.
      </p>

      <TopicSuggestForm />
    </section>
  );
};

export default SuggestTopicPage;
