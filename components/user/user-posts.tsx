import { getQueryClient } from "@/lib/get-query-client";
import { User } from "@/sanity.types";
import getAllUserPosts from "@/sanity/lib/posts/getAllUserPosts";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserInfinitePosts from "./user-infinite-posts";

type UserPostsProps = {
  user: User | null;
};

const UserPosts = async ({ user }: UserPostsProps) => {
  if (!user || !user.clerkId) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No user posts found.
      </div>
    );
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "user", user.clerkId],
    queryFn: ({ pageParam = 0 }) =>
      getAllUserPosts({ clerkId: user.clerkId, limit: 3, page: pageParam }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserInfinitePosts user={user} />
    </HydrationBoundary>
  );
};

export default UserPosts;
