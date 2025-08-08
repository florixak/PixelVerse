"use client";

import { SignedIn, SignOutButton, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserCardProps = {
  collapsed?: boolean;
};

const UserCard = ({ collapsed }: UserCardProps) => {
  const { user } = useClerk();
  if (!user) {
    return null;
  }

  return (
    <SignedIn key={user.id}>
      <div
        className={`flex items-center gap-2  ${
          collapsed
            ? "flex-col text-center"
            : "flex-row justify-between w-full p-2"
        }`}
      >
        {!collapsed && (
          <div className="text-nowrap">
            <p className="font-semibold">{user.fullName || user.username}</p>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        )}
        <Link href={`/user/${user.username}`} className="flex-shrink-0">
          <Avatar>
            <AvatarImage
              src={user.imageUrl || "/avatar-default.svg"}
              alt={user.fullName || user.username || "User Avatar"}
              className="rounded-full cursor-pointer"
            />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      <Button asChild variant="outline" className="w-full">
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
