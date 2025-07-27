"use client";

import { useState } from "react";
import { createPost, updatePost } from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Post, Topic } from "@/sanity.types";
import TutorialFields from "./tutorial-fields";
import ConditionalFields from "./conditional-fields";
import BasicFields from "./basic-fields";
import toast from "react-hot-toast";
import SubmitButton from "@/components/submit-button";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SoftwareOptionType } from "@/types/posts";

type CreatePostFormProps = {
  topics: Topic[];
  topic: Topic | null;
  post?: Post | null;
  className?: string;
  onSuccess?: () => void;
};

export type ColorPaletteItem = {
  hex: string;
  name: string;
};

export type TutorialStepType = {
  title: string;
  description: string;
  imageUrl: string;
};

type FormState = {
  postType: Post["postType"];
  isOriginal: boolean;
  disabledComments: boolean;
  software: SoftwareOptionType["value"][];
  colorPalette: ColorPaletteItem[];
  tutorialSteps: TutorialStepType[];
  tags: string[];
};

export default function CreatePostForm({
  topics,
  topic,
  post,
  className,
  onSuccess,
}: CreatePostFormProps) {
  const [formState, setFormState] = useState<FormState>({
    postType: post?.postType || "text",
    isOriginal: post?.isOriginal ?? true,
    disabledComments: post?.disabledComments ?? false,
    software: post?.software || [],
    colorPalette:
      post?.colorPalette?.map((cp) => ({
        hex: cp.hex || "",
        name: cp.name || "",
      })) || [],
    tutorialSteps:
      post?.tutorialSteps?.map((ts) => ({
        title: ts.title || "",
        description: ts.description || "",
        imageUrl: ts.imageUrl || "",
      })) || [],
    tags: post?.tags || [],
  });
  const router = useRouter();

  const updateFormState = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSoftwareChange = (value: string) => {
    const currentSoftware = formState.software;
    if (currentSoftware.includes(value)) {
      updateFormState(
        "software",
        currentSoftware.filter((s) => s !== value)
      );
    } else {
      updateFormState("software", [...currentSoftware, value]);
    }
  };

  const addColorToPalette = () => {
    updateFormState("colorPalette", [
      ...formState.colorPalette,
      { hex: "#000000", name: "" },
    ]);
  };

  const updateColorPalette = (
    index: number,
    field: "hex" | "name",
    value: string
  ) => {
    const updated = [...formState.colorPalette];
    updated[index][field] = value;
    updateFormState("colorPalette", updated);
  };

  const removeColorFromPalette = (index: number) => {
    const updated = formState.colorPalette.filter((_, i) => i !== index);
    updateFormState("colorPalette", updated);
  };

  const addTutorialStep = () => {
    updateFormState("tutorialSteps", [
      ...formState.tutorialSteps,
      { title: "", description: "", imageUrl: "" },
    ]);
  };

  const updateTutorialStep = (
    index: number,
    field: keyof TutorialStepType,
    value: string
  ) => {
    const updated = [...formState.tutorialSteps];
    updated[index][field] = value;
    updateFormState("tutorialSteps", updated);
  };

  const removeTutorialStep = (index: number) => {
    const updated = formState.tutorialSteps.filter((_, i) => i !== index);
    updateFormState("tutorialSteps", updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      if (formState.software.length > 0) {
        formData.set("software", JSON.stringify(formState.software));
      }

      if (formState.colorPalette.length > 0) {
        formData.set("colorPalette", JSON.stringify(formState.colorPalette));
      }

      if (formState.tutorialSteps.length > 0) {
        formData.set("tutorialSteps", JSON.stringify(formState.tutorialSteps));
      }

      formData.set("isOriginal", String(formState.isOriginal));
      formData.set("disabledComments", String(formState.disabledComments));

      if (formState.tags.length > 0) {
        formData.set("tags", formState.tags.join(","));
      }

      if (post) {
        const result = await updatePost(formData, post._id);
        toast.success(
          `Post updated successfully! Your post "${post.title}" has been updated.`,
          { duration: 5000 }
        );
        onSuccess?.();
        router.push(`/topics/${result.topicSlug}/${result.newSlug}`);
      } else {
        const result = await createPost(formData);
        toast.success(
          `Post created successfully! Your post "${result.title}" has been created.`,
          { duration: 5000 }
        );
        router.push(`/topics/${result.topicSlug}/${result.slug}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.", {
        duration: 5000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-8 max-w-4xl mx-auto w-full p-6", className)}
    >
      {/* Basic Fields */}
      <BasicFields
        topics={topics}
        setPostType={(value) => updateFormState("postType", value)}
        topicId={topic?._id}
        post={post}
        tags={formState.tags}
        setTags={(value) => updateFormState("tags", value)}
        postType={formState.postType}
        disabledComments={formState.disabledComments}
        setDisabledComments={(value) =>
          updateFormState("disabledComments", value)
        }
      />
      {/* Conditional Fields Based on Post Type */}
      {(formState.postType === "pixelArt" ||
        formState.postType === "animation") && (
        <ConditionalFields
          postType={formState.postType}
          isOriginal={formState.isOriginal}
          setIsOriginal={(value) => updateFormState("isOriginal", value)}
          software={formState.software}
          handleSoftwareChange={handleSoftwareChange}
          colorPalette={formState.colorPalette}
          addColorTopalette={addColorToPalette}
          updateColorPalette={updateColorPalette}
          removeColorFromPalette={removeColorFromPalette}
          post={post}
        />
      )}
      {/* Tutorial-specific fields */}
      {formState.postType === "tutorial" && (
        <TutorialFields
          tutorialSteps={formState.tutorialSteps}
          addTutorialStep={addTutorialStep}
          updateTutorialStep={updateTutorialStep}
          removeTutorialStep={removeTutorialStep}
        />
      )}
      <div className="flex justify-end space-x-4">
        {post ? (
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              post ? router.push(`/topics/${topic?.slug}`) : router.back()
            }
          >
            Cancel
          </Button>
        )}

        <SubmitButton
          label={post ? "Update post" : "Create post"}
          submittingLabel={post ? "Updating..." : "Creating..."}
        />
      </div>
    </form>
  );
}
