"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { User } from "@/sanity.types";
import toast from "react-hot-toast";
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
import { updateUserRole } from "@/actions/adminActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type RoleSelectProps = {
  currentUser: User | null;
  targetUser: User;
  defaultRole: User["role"];
};

const AdminRoleSelect = ({
  currentUser,
  targetUser,
  defaultRole,
}: RoleSelectProps) => {
  const [actualRole, setActualRole] = useState<User["role"]>(defaultRole);
  const [displayedRole, setDisplayedRole] = useState<User["role"]>(defaultRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingRole, setPendingRole] = useState<User["role"] | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleValueChange = (newRole: string) => {
    if (!["admin", "moderator", "user"].includes(newRole)) {
      return;
    }

    if (newRole === actualRole) {
      return;
    }

    // Admin role requires confirmation
    if (newRole === "admin" && actualRole !== "admin") {
      setPendingRole(newRole as User["role"]);
      setShowConfirm(true);
      return;
    }

    // For other roles, apply directly
    applyRoleChange(newRole as User["role"]);
  };

  const applyRoleChange = async (newRole: User["role"]) => {
    try {
      setIsUpdating(true);
      setDisplayedRole(newRole);
      toast.loading("Updating role...", {
        id: "role-update",
        duration: 0,
      });

      const response = await updateUserRole(targetUser._id, newRole);

      if (!response.success) {
        setDisplayedRole(actualRole);
        toast.error(response.message || "Failed to update role");
        return;
      }
      toast.dismiss("role-update");

      setActualRole(newRole);
      toast.success("Role updated successfully");
    } catch (error) {
      setDisplayedRole(actualRole);
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    } finally {
      setIsUpdating(false);
      setPendingRole(null);
    }
  };

  const confirmRoleChange = () => {
    if (pendingRole) {
      applyRoleChange(pendingRole);
    }
    setShowConfirm(false);
  };

  const cancelRoleChange = () => {
    setPendingRole(null);
    setShowConfirm(false);
  };

  if (!currentUser || !targetUser) {
    return null;
  }

  if (targetUser.role === "admin") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select disabled value="admin">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          Admin roles cannot be modified by other admins
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <Select
        value={displayedRole}
        onValueChange={handleValueChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder={displayedRole} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        key={"confirm-admin-role"}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Admin Role</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to grant full administrative access to this user.
              This will allow them to manage all content and users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRoleChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminRoleSelect;
