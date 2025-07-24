"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { User } from "@/sanity.types";
import { updateProfile } from "@/actions/profileActions";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

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
  const originalValues: ProfileData = {
    fullName: user.fullName,
    username: user.username,
    bio: user.bio,
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
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

      <div className="flex gap-3 pt-4">
        <form.Subscribe
          selector={(state) => ({
            values: state.values,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ values, isSubmitting }) => {
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
                  disabled={isSubmitting || !hasChanges}
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
  );
};

export default UserProfileEditForm;
