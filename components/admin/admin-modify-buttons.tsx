"use client";

import { User } from "@/sanity.types";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import toast from "react-hot-toast";
import { deleteUser } from "@/actions/admin-actions";

type AdminModifyButtonsProps = {
  currentUser: User | null;
  targetUser: User | null;
};

const AdminModifyButtons = ({
  currentUser,
  targetUser,
}: AdminModifyButtonsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!currentUser || !targetUser) {
    return null;
  }
  if (!canModifyUser(currentUser, targetUser)) {
    return null;
  }

  const handleDeleteUser = async () => {
    if (!canModifyUser(currentUser, targetUser)) {
      toast.error("You do not have permission to delete this user.");
      return;
    }
    if (!targetUser || !currentUser) return;

    setShowConfirm(true);
    toast.promise(deleteUser(targetUser._id), {
      loading: "Deleting user...",
      success: () => {
        return `User ${targetUser.username} deleted successfully.`;
      },
      error: (error) => {
        return `Failed to delete user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      },
    });
  };

  const confirmDeleteUser = async () => {
    setShowConfirm(false);
    await handleDeleteUser();
  };

  const cancelDeleteUser = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={!canModifyUser(currentUser, targetUser)}
      >
        <Link href={`/admin/users/${targetUser._id}`}>Edit</Link>
      </Button>

      <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
        Delete
      </Button>
      <AlertDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        key={`confirm-delete-user-${targetUser._id}`}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone. All content created by this user will also be deleted.
              Please confirm if you wish to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteUser}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
