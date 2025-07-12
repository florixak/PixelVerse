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

type UserProfileEditFormProps = {
  user: User;
  onSave?: (data: FormData) => void;
  onCancel?: () => void;
};

export type FormData = {
  fullName: User["fullName"];
  username: User["username"];
  bio: User["bio"];
};

type FormErrors = {
  fullName?: string;
  username?: string;
  bio?: string;
};

const UserProfileEditForm = ({
  user,
  onSave,
  onCancel,
}: UserProfileEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: user.fullName || "",
    username: user.username || "",
    bio: user.bio || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (formData.fullName && formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    if (formData.fullName && formData.fullName.length > 50) {
      newErrors.fullName = "Full name must be less than 50 characters";
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, hyphens, and underscores";
    }

    // Bio validation
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call
      const response = await updateProfile(formData);

      if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      toast.success(response.message || "Profile updated successfully");

      if (onSave) {
        onSave(formData);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      bio: user.bio || "",
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  const hasChanges =
    JSON.stringify(formData) !==
    JSON.stringify({
      fullName: user.fullName || "",
      username: user.username || "",
      bio: user.bio || "",
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Only letters, numbers, hyphens, and underscores allowed
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          rows={4}
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className={errors.bio ? "border-red-500" : ""}
        />
        {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
        <p className="text-xs text-muted-foreground">Maximum 500 characters</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !hasChanges}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserProfileEditForm;
