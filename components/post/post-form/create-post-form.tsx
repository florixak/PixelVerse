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

export default function CreatePostForm({
  topics,
  topic,
  post,
  className,
  onSuccess,
}: CreatePostFormProps) {
  const [postType, setPostType] = useState<Post["postType"]>(post?.postType);
  const [isOriginal, setIsOriginal] = useState<boolean>(
    post?.isOriginal ?? true
  );
  const [disabledComments, setDisabledComments] = useState<boolean>(
    post?.disabledComments ?? false
  );
  const [software, setSoftware] = useState<SoftwareOptionType["value"][]>(
    post?.software || []
  );
  const [colorPalette, setColorPalette] = useState<ColorPaletteItem[]>(
    post?.colorPalette?.map((cp) => ({
      hex: cp.hex || "",
      name: cp.name || "",
    })) || []
  );
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStepType[]>(
    post?.tutorialSteps?.map((ts) => ({
      title: ts.title || "",
      description: ts.description || "",
      imageUrl: ts.imageUrl || "",
    })) || []
  );
  const [tags, setTags] = useState<Post["tags"]>(post?.tags || []);
  const router = useRouter();

  const handleSoftwareChange = (value: string) => {
    if (software.includes(value)) {
      setSoftware(software.filter((s) => s !== value));
    } else {
      setSoftware([...software, value]);
    }
  };

  const addColorTopalette = () => {
    setColorPalette([...colorPalette, { hex: "", name: "" }]);
  };

  const updateColorPalette = (
    index: number,
    field: "hex" | "name",
    value: string
  ) => {
    const updated = [...colorPalette];
    updated[index][field] = value;
    setColorPalette(updated);
  };

  const addTutorialStep = () => {
    setTutorialSteps([
      ...tutorialSteps,
      { title: "", description: "", imageUrl: "" },
    ]);
  };

  const updateTutorialStep = (
    index: number,
    field: keyof (typeof tutorialSteps)[0],
    value: string
  ) => {
    const updated = [...tutorialSteps];
    updated[index][field] = value;
    setTutorialSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      if (software !== undefined && software.length > 0) {
        formData.set("software", JSON.stringify(software));
      }

      if (colorPalette !== undefined && colorPalette.length > 0) {
        formData.set("colorPalette", JSON.stringify(colorPalette));
      }

      if (tutorialSteps !== undefined && tutorialSteps.length > 0) {
        formData.set("tutorialSteps", JSON.stringify(tutorialSteps));
      }

      if (isOriginal !== undefined) {
        formData.set("isOriginal", String(isOriginal));
      }

      if (disabledComments !== undefined) {
        formData.set("disabledComments", String(disabledComments));
      }

      if (tags !== undefined && tags.length > 0) {
        formData.set("tags", tags.join(","));
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
        setPostType={setPostType}
        topicId={topic?._id}
        post={post}
        tags={tags}
        setTags={setTags}
        postType={postType}
        disabledComments={disabledComments}
        setDisabledComments={setDisabledComments}
      />
      {/* Conditional Fields Based on Post Type */}
      {(postType === "pixelArt" || postType === "animation") && (
        <ConditionalFields
          postType={postType}
          isOriginal={isOriginal}
          setIsOriginal={setIsOriginal}
          software={software}
          handleSoftwareChange={handleSoftwareChange}
          colorPalette={colorPalette}
          addColorTopalette={addColorTopalette}
          updateColorPalette={updateColorPalette}
          post={post}
        />
      )}
      {/* Tutorial-specific fields */}
      {postType === "tutorial" && (
        <TutorialFields
          tutorialSteps={tutorialSteps}
          addTutorialStep={addTutorialStep}
          updateTutorialStep={updateTutorialStep}
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
