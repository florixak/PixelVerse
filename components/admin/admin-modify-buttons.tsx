"use client";

import { User } from "@/sanity.types";
import { Button } from "../ui/button";
import Link from "next/link";

type AdminModifyButtonsProps = {
  currentUser: User | null;
  targetUser: User | null;
};

const AdminModifyButtons = ({
  currentUser,
  targetUser,
}: AdminModifyButtonsProps) => {
  if (!currentUser || !targetUser) {
    return null;
  }
  if (!canModifyUser(currentUser, targetUser)) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/users/${targetUser._id}`}
        className="text-blue-600 hover:underline"
      >
        Edit
      </Link>

      <Button variant="destructive" size="sm" onClick={() => {}}>
        Delete
      </Button>
    </div>
  );
};

const canModifyUser = (currentUser: User, targetUser: User): boolean => {
  if (targetUser.role === "admin" && currentUser.role === "admin") {
    return false;
  }

  if (currentUser.clerkId === targetUser.clerkId) {
    return false;
  }

  return true;
};

export default AdminModifyButtons;
