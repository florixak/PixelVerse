"use client";

import { User as SanityUser } from "@/sanity.types";
import ThreeDotsSelect from "../three-dots-select";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import UserProfileEditForm from "./user-profile-edit-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FollowStatus,
  followUser,
  isFollowingUser,
  unfollowUser,
} from "@/actions/follow-actions";
import { getQueryClient } from "@/lib/get-query-client";
import { useClerk } from "@clerk/nextjs";

type UserActionsProps = {
  targetUser: SanityUser | null;
};

const UserActions = ({ targetUser }: UserActionsProps) => {
  const currentUser = useClerk().user;
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { openSignIn } = useClerk();

  const queryClient = getQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["followStatus", targetUser?._id],
    queryFn: async () => {
      if (!targetUser?._id) return null;
      const { isFollowing, error, success } = await isFollowingUser(
        targetUser._id
      );
      if (error) {
        return {
          isFollowing: false,
          error,
          success: false,
        };
      }
      return { isFollowing, error, success };
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!targetUser?._id) return null;
      const response = await followUser(targetUser._id);
      if (!response.success) {
        throw new Error(response.error || "Failed to follow/unfollow user");
      }
      return response;
    },
    onMutate: () => {
      if (!targetUser?._id) return null;
      queryClient.setQueryData(
        ["followStatus", targetUser._id],
        (oldData: FollowStatus) => ({
          ...oldData,
          isFollowing: oldData ? !oldData.isFollowing : true,
        })
      );
    },
    onSuccess: (data) => {
      toast.success(`Successfully ${data?.action} user`);
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: async () => {
      if (!targetUser?._id) return null;
      const response = await unfollowUser(targetUser._id);
      if (!response.success) {
        throw new Error(response.error || "Failed to unfollow user");
      }
      return response;
    },
    onMutate: () => {
      if (!targetUser?._id) return null;
      queryClient.setQueryData(
        ["followStatus", targetUser._id],
        (oldData: FollowStatus) => ({
          ...oldData,
          isFollowing: false,
        })
      );
    },
    onSuccess: () => {
      toast.success(`Successfully unfollowed user`);
    },
  });

  const handleFollow = async () => {
    if (!currentUser) {
      openSignIn();
      return;
    }

    try {
      if (data?.isFollowing) {
        await unFollowMutation.mutateAsync();
      } else {
        await followMutation.mutateAsync();
      }
    } catch (error) {
      if (data?.isFollowing) {
        toast.error("Failed to unfollow user");
      } else {
        toast.error("Failed to follow user");
      }
    }
  };

  if (!targetUser) return null;

  const isUsersProfile = targetUser?.clerkId === currentUser?.id;

  return (
    <div className="flex flex-row items-center gap-4 justify-center sm:justify-start">
      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetTrigger asChild>
          {isUsersProfile && (
            <Button variant="secondary" className="px-6">
              Edit
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="w-full max-w-xl md:max-w-2xl overflow-y-auto px-6 md:px-12 py-4">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Make changes to your profile.</SheetDescription>
          </SheetHeader>
          <UserProfileEditForm
            user={targetUser}
            onCancel={() => setEditing(false)}
          />
        </SheetContent>
      </Sheet>

      {!isUsersProfile && (
        <Button
          className="px-6"
          variant={data?.isFollowing ? "destructive" : "default"}
          disabled={!targetUser || isLoading}
          onClick={handleFollow}
          aria-label="Follow/Unfollow User"
        >
          {isLoading ? "Loading..." : data?.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
      <ThreeDotsSelect
        options={[
          {
            label: "Report User",
            value: "report",
            onSelect: () => router.push(`/report/user/${targetUser.username}`),
          },
        ]}
      />
    </div>
  );
};

export default UserActions;
