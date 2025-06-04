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
import { LogOut } from "lucide-react";

type UserCardProps = {
  collapsed?: boolean;
};

const UserCard = ({ collapsed }: UserCardProps) => {
  const { user } = useUser();
  if (!user) {
    return null;
  }

  return (
    <SignedIn key={user.id}>
      <div
        className={`flex items-center gap-2 p-2 ${
          collapsed ? "flex-col text-center" : "flex-row justify-between w-full"
        }`}
      >
        {!collapsed &&
          (user.firstName && user.lastName ? (
            <span className="text-sm font-semibold">
              {user.firstName} {user.lastName}
            </span>
          ) : (
            <span className="text-sm font-semibold">
              {user.username || user.emailAddresses[0]?.emailAddress || "User"}
            </span>
          ))}

        <UserButton />
      </div>
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
