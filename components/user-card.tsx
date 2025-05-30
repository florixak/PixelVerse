"use client";

import { SignedIn, useClerk, UserButton } from "@clerk/nextjs";
import React from "react";

type UserCardProps = {
  collapsed?: boolean;
};

const UserCard = ({ collapsed }: UserCardProps) => {
  const user = useClerk().user;
  if (!user) {
    return null;
  }

  return (
    <SignedIn>
      <div
        className={`flex items-center gap-2 p-2 ${
          !collapsed
            ? "flex-col text-center"
            : "flex-row justify-between w-full"
        }`}
      >
        {collapsed &&
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
    </SignedIn>
  );
};

export default UserCard;
