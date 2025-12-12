import { getSearchResults } from "@/sanity/lib/search/getSearchResults";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MasonryWrapper from "../masonry-wrapper";
import PostCard from "../post/post-card";
import TopicCard from "../topic/topic-card";
import UserSearchCard from "../user/user-search-card";

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
          <MasonryWrapper>
            {topics.map((topic) => (
              <TopicCard key={topic._id} topic={topic} />
            ))}
          </MasonryWrapper>
        </div>
      )}

      {users.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {users.map((u) => (
              <UserSearchCard key={u._id} user={u} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default PostResults;
