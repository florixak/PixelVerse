import { isFollowingUser } from "@/actions/follow-actions";
import { getQueryClient } from "@/lib/get-query-client";
import { User } from "@/sanity.types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import UserActions from "./user-actions";

type UserActionsWrapperProps = {
  user: User | null;
};

const UserActionsWrapper = async ({ user }: UserActionsWrapperProps) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["followStatus", user?._id],
    queryFn: async () => {
      if (!user?._id) return null;
      const { isFollowing, error, success } = await isFollowingUser(user._id);
      if (error) {
        console.error("Error checking following status:", error);
        return null;
      }
      return { isFollowing, error, success };
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserActions user={user} />
    </HydrationBoundary>
  );
};

export default UserActionsWrapper;
