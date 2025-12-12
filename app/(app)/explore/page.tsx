import ExploreLoadingSkeleton from "@/components/explore/explore-loading-skeleton";
import PostResults from "@/components/explore/post-results";
import SearchBar from "@/components/explore/search-bar";
import TrendingPosts from "@/components/explore/trending-posts";
import { Suspense } from "react";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
  const { q, page } = await searchParams;

  const isSearchMode = Boolean(q && q.trim().length > 0);

  return (
    <section className="relative max-w-6xl mx-auto flex flex-col gap-4 py-8 px-4 md:px-0">
      <div className="text-center max-w-4xl mx-auto flex items-center flex-col gap-2">
        <h1 className="text-2xl font-bold">
          {isSearchMode ? "Search Results" : "Explore"}
        </h1>
        <p className="text-muted-foreground">
          {isSearchMode
            ? `Results for "${q}"`
            : "Discover trending posts and topics from the community."}
        </p>

        <SearchBar />
      </div>
      <Suspense fallback={<ExploreLoadingSkeleton />}>
        {isSearchMode ? (
          <PostResults searchQuery={q || ""} pageNumber={Number(page) || 1} />
        ) : (
          <TrendingPosts />
        )}
      </Suspense>
    </section>
  );
};

export default ExplorePage;
