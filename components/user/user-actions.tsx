"use client";

import { User } from "@/sanity.types";
import ThreeDotsSelect from "../three-dots-select";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type UserActionsProps = {
  user: User | null;
};

const UserActions = ({ user }: UserActionsProps) => {
  const router = useRouter();
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-row items-center gap-4 justify-center sm:justify-start">
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
