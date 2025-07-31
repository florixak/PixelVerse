"use client";

import { User } from "@/sanity.types";
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

type UserActionsProps = {
  user: User | null;
  isUsersProfile: boolean;
};

const UserActions = ({ user, isUsersProfile }: UserActionsProps) => {
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  if (!user) {
    return null;
  }

  const queryClient = getQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["followStatus", user._id],
    queryFn: async () => {
      if (!user._id) return null;
      const { isFollowing, error, success } = await isFollowingUser(user._id);
      if (error) {
        console.error("Error checking following status:", error);
        return null;
      }
      return { isFollowing, error, success };
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await followUser(user._id);
      if (!response.success) {
        throw new Error(response.error || "Failed to follow/unfollow user");
      }
      return response;
    },
    onMutate: () => {
      queryClient.setQueryData(
        ["followStatus", user._id],
        (oldData: FollowStatus) => ({
          ...oldData,
          isFollowing: oldData ? !oldData.isFollowing : true,
        })
      );
    },
    onSuccess: (data) => {
      toast.success(`Successfully ${data.action} user`);
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: async () => {
      const response = await unfollowUser(user._id);
      if (!response.success) {
        throw new Error(response.error || "Failed to unfollow user");
      }
      return response;
    },
    onMutate: () => {
      queryClient.setQueryData(
        ["followStatus", user._id],
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
    if (!user) return;

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

  return (
    <div className="flex flex-row items-center gap-4 justify-center sm:justify-start">
      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetTrigger asChild>
          {isUsersProfile && (
            <Button variant="outline" className="px-6">
              Edit
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="w-full max-w-xl md:max-w-2xl overflow-y-auto px-6 md:px-12 py-4">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Make changes to your profile.</SheetDescription>
          </SheetHeader>
          <UserProfileEditForm user={user} onCancel={() => setEditing(false)} />
        </SheetContent>
      </Sheet>

      {!isUsersProfile && (
        <Button
          className="px-6"
          variant={data?.isFollowing ? "destructive" : "default"}
          disabled={!user}
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
            onSelect: () => router.push(`/report/user/${user.username}`),
          },
          {
            label: "Send Message (Coming Soon)",
            value: "message",
            onSelect: () => console.log("Send Message"),
          },
          {
            label: "Add Friend (Coming Soon)",
            value: "add-friend",
            onSelect: () => console.log("Add Friend"),
          },
          {
            label: "Mute User (Coming Soon)",
            value: "mute",
            onSelect: () => console.log("Mute User"),
          },
        ]}
      />
    </div>
  );
};

export default UserActions;
