"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { User } from "@/sanity.types";
import { deleteUserAccount, updateProfile } from "@/actions/profile-actions";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
type UserProfileEditFormProps = {
  user: User;
  onSave?: (data: ProfileData) => void;
  onCancel?: () => void;
};

export type ProfileData = {
  fullName: User["fullName"];
  username: User["username"];
  bio: User["bio"];
};

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    ),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
});

const UserProfileEditForm = ({
  user,
  onSave,
  onCancel,
}: UserProfileEditFormProps) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const originalValues: ProfileData = {
    fullName: user.fullName || "",
    username: user.username || "",
    bio: user.bio || "",
  };

  const form = useForm({
    defaultValues: originalValues,
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await updateProfile(value);

        if (!response.success) {
          throw new Error(response.message || "Failed to update profile");
        }

        toast.success(response.message || "Profile updated successfully");

        if (onSave) {
          onSave(value);
        }
      } catch (error: any) {
        toast.error(
          error.message || "An error occurred while updating profile"
        );
        console.error("Error updating profile:", error);
      }
    },
  });

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      try {
        await deleteUserAccount();
        toast.success("Account deleted successfully");
        if (onCancel) {
          onCancel();
        }
        await signOut();
        router.push("/");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    } catch (error) {
      toast.error("An error occurred while deleting account");
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field name="fullName">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors.map((error, index) => (
                    <div key={index}>{error?.message}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="username">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors.map((error, index) => (
                    <div key={index}>{error?.message}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="bio">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors.map((error, index) => (
                    <div key={index}>{error?.message}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form.Field>

        <div className="flex gap-3 pt-4">
          <form.Subscribe
            selector={(state) => ({
              values: state.values,
              isSubmitting: state.isSubmitting,
              isValid: state.isValid,
            })}
          >
            {({ values, isSubmitting, isValid }) => {
              const hasChanges =
                values.fullName !== originalValues.fullName ||
                values.username !== originalValues.username ||
                values.bio !== originalValues.bio;

              return (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !hasChanges || !isValid}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : hasChanges ? (
                      "Update Profile"
                    ) : (
                      "No Changes"
                    )}
                  </Button>
                </>
              );
            }}
          </form.Subscribe>
        </div>
      </form>
      <div className="border-t pt-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Danger Zone
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Once you delete your account, there is no going back. This will
            permanently delete your profile, posts, comments, and all associated
            data.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </>
                )}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <p>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mt-3">
                      <p className="font-semibold text-red-800 dark:text-red-200 text-sm mb-1">
                        This will delete:
                      </p>
                      <ul className="text-xs text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                        <li>Your profile and account information</li>
                        <li>All your posts and uploaded images</li>
                        <li>Your comments and interactions</li>
                        <li>Your topic suggestions and reports</li>
                        <li>
                          All associated data from both Clerk and our database
                        </li>
                      </ul>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, delete my account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditForm;
