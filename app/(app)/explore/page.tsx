import SearchBar from "@/components/explore/search-bar";
import MasonryWrapper from "@/components/masonry-wrapper";
import PostCard from "@/components/post/post-card";
import TopicCard from "@/components/topic/topic-card";
import { Skeleton } from "@/components/ui/skeleton";
import UserSearchCard from "@/components/user/user-search-card";
import { getTrendingContent } from "@/sanity/lib/featured/getTrendingContent";
import { getSearchResults } from "@/sanity/lib/search/getSearchResults";
import { currentUser, User } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
  const { q, page } = await searchParams;
  const isSearchMode = Boolean(q && q.trim().length > 0);

  return (
    <section className="relative max-w-6xl mx-auto flex flex-col gap-4 py-8 px-4 md:px-0">
      <div className="text-center max-w-4xl mx-auto flex flex-col">
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

      <Suspense fallback={<PostsLoadingSkeleton />}>
        {isSearchMode ? (
          <PostResults searchQuery={q || ""} pageNumber={Number(page) || 1} />
        ) : (
          <TrendingPosts />
        )}
      </Suspense>
    </section>
  );
};

const PostResults = async ({
  searchQuery,
  pageNumber,
}: {
  searchQuery: string;
  pageNumber: number;
}) => {
  const {
    posts,
    topics,
    users,
    totalPosts,
    totalTopics,
    totalUsers,
    validationMessage,
  } = await getSearchResults({
    query: searchQuery,
    page: pageNumber,
    limit: 12,
  });

  if (validationMessage) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2">No results found</h2>
        <p className="text-muted-foreground mb-4">{validationMessage}</p>
        <Link
          href="/explore"
          className="text-primary hover:underline inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to trending content
        </Link>
      </div>
    );
  }

  const totalResults = totalPosts + totalTopics + totalUsers;

  /*console.log("Search Results:", {
    searchQuery,
    pageNumber,
    totalPosts,
    totalTopics,
    totalUsers,
    posts,
    topics,
    users,
  });*/

  if (totalResults === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2">No results found</h2>
        <p className="text-muted-foreground mb-4">
          Try searching for something else.
        </p>
        <Link
          href="/explore"
          className="text-primary hover:underline inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to trending content
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Found {totalResults} {totalResults === 1 ? "result" : "results"}
        </p>

        {/* Pagination controls here if needed */}
      </div>

      {posts.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Posts</h2>
          <MasonryWrapper>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </MasonryWrapper>
        </div>
      )}

      {topics.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Topics</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topics.map((topic) => (
              <li key={topic._id}>
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {users.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <ul className="space-y-2">
            {users.map((u) => (
              <UserSearchCard key={u._id} user={u} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

const TrendingPosts = async () => {
  const posts = await getTrendingContent();
  return (
    <MasonryWrapper className="mt-4">
      {posts.posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </MasonryWrapper>
  );
};

function PostsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
      ))}
    </div>
  );
}

export default ExplorePage;
