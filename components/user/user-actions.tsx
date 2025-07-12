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
            <SheetTitle>Edit Post</SheetTitle>
            <SheetDescription>
              Make changes to your post. All changes will be saved
              automatically.
            </SheetDescription>
          </SheetHeader>
          <UserProfileEditForm user={user} onCancel={() => setEditing(false)} />
        </SheetContent>
      </Sheet>

      <Button className="px-6" disabled={!user}>
        Follow
      </Button>
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
