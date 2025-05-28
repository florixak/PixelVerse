"use client";

import { SignedIn, useClerk, UserButton } from "@clerk/nextjs";
import React from "react";

const UserCard = () => {
  const user = useClerk().user;
  if (!user) {
    return null;
  }

  return (
    <SignedIn>
      <div className="flex items-center justify-between p-4 gap-4">
        {user.firstName && user.lastName ? (
          <span className="text-sm font-semibold">
            {user.firstName} {user.lastName}
          </span>
        ) : (
          <span className="text-sm font-semibold">
            {user.username || user.emailAddresses[0]?.emailAddress || "User"}
          </span>
        )}

        <UserButton />
      </div>
    </SignedIn>
  );
};

export default UserCard;
