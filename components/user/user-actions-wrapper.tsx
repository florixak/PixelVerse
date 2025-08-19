import { isFollowingUser } from "@/actions/follow-actions";
import { getQueryClient } from "@/lib/get-query-client";
import { User } from "@/sanity.types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import UserActions from "./user-actions";
import { currentUser } from "@clerk/nextjs/server";

type UserActionsWrapperProps = {
  user: User | null;
};

const UserActionsWrapper = async ({ user }: UserActionsWrapperProps) => {
  if (!user || !user?._id) return null;

  const currUser = await currentUser();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["followStatus", user?._id],
    queryFn: async () => {
      if (!user?._id) return null;
      const { isFollowing, error, success } = await isFollowingUser(user._id);
      if (error) {
        return {
          isFollowing: false,
          error,
          success,
        };
      }
      return { isFollowing, error, success };
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserActions targetUser={user} currentUser={currUser} />
    </HydrationBoundary>
  );
};

export default UserActionsWrapper;
