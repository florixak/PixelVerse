import { getQueryClient } from "@/lib/get-query-client";
import { User } from "@/sanity.types";
import getAllUserPosts from "@/sanity/lib/posts/getAllUserPosts";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserInfinitePosts from "./user-infinite-posts";
import { SortOrder } from "@/types/filter";

type UserPostsProps = {
  user: User | null;
  sort?: SortOrder;
};

const UserPosts = async ({ user, sort = "latest" }: UserPostsProps) => {
  if (!user || !user.clerkId) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No user posts found.
      </div>
    );
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "user", user.clerkId, sort],
    queryFn: ({ pageParam = 0 }) =>
      getAllUserPosts({
        clerkId: user.clerkId,
        limit: 3,
        page: pageParam,
        sort,
      }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserInfinitePosts user={user} sort={sort} />
    </HydrationBoundary>
  );
};

export default UserPosts;
