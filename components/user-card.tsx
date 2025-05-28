"use client";

import { SignedIn, useClerk, UserButton } from "@clerk/nextjs";
import React from "react";

const UserCard = () => {
  const user = useClerk().user;
  if (!user) {
    return null; // or return a placeholder if needed
  }

  return (
    <div className="flex items-center justify-between p-4 gap-4 h-16">
      {user.firstName && user.lastName ? (
        <span className="text-sm font-semibold">
          {user.firstName} {user.lastName}
        </span>
      ) : (
        <span className="text-sm font-semibold">
          {user.username || user.emailAddresses[0]?.emailAddress || "User"}
        </span>
      )}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default UserCard;
