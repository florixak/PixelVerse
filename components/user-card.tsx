"use client";

import { SignedIn, SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
          <Image
            src={user.imageUrl || "/avatar-default.svg"}
            alt={user.fullName || user.username || "User Avatar"}
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
          />
        </Link>
      </div>
      <Button
        variant="ghost"
        className="w-full"
        onClick={handleUserButtonClick}
      >
        <Settings />
        <span className={`${collapsed ? "hidden" : "block"}`}>Settings</span>
      </Button>

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
