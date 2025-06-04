"use client";

import {
  SignedIn,
  SignOutButton,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { LogOut, Settings } from "lucide-react";

type UserCardProps = {
  collapsed?: boolean;
};

const UserCard = ({ collapsed }: UserCardProps) => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  if (!user) {
    return null;
  }

  const handleUserButtonClick = () => {
    openUserProfile();
  };

  return (
    <SignedIn key={user.id}>
      <div
        className={`flex items-center gap-2 p-2 ${
          collapsed ? "flex-col text-center" : "flex-row justify-between w-full"
        }`}
      >
        {!collapsed && (
          <div>
            <p className="font-semibold">{user.fullName || user.username}</p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        )}

        <UserButton />
      </div>
      <Button
        variant="ghost"
        className="w-full"
        onClick={handleUserButtonClick}
      >
        <Settings />
        <span className={`${collapsed ? "hidden" : "block"}`}>Settings</span>
      </Button>

      <Button asChild variant="default" className="w-full">
        <SignOutButton>
          <div className="flex items-center gap-2 justify-center">
            <LogOut className="h-4 w-4" />
            <span className={`${collapsed ? "hidden" : "block"}`}>
              Sign Out
            </span>
          </div>
        </SignOutButton>
      </Button>
    </SignedIn>
  );
};

export default UserCard;
