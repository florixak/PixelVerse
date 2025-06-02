"use client";

import { useState } from "react";
import { createPost } from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Topic } from "@/sanity.types";
import TutorialFields from "./tutorial-fields";
import ConditionalFields from "./conditional-fields";
import BasicFields from "./basic-fields";
import toast from "react-hot-toast";

type CreatePostFormProps = {
  topics: Topic[];
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

export default function CreatePostForm({ topics }: CreatePostFormProps) {
  const [postType, setPostType] = useState("text");
  const [isOriginal, setIsOriginal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [software, setSoftware] = useState<string[]>([]);
  const [colorPalette, setColorPalette] = useState<ColorPaletteItem[]>([]);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStepType[]>([]);
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
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add array data that's not directly in the form
      if (software.length > 0) {
        formData.set("software", JSON.stringify(software));
      }

      if (colorPalette.length > 0) {
        formData.set("colorPalette", JSON.stringify(colorPalette));
      }

      if (tutorialSteps.length > 0) {
        formData.set("tutorialSteps", JSON.stringify(tutorialSteps));
      }

      const result = await createPost(formData);

      toast.success(
        `Post created successfully! Your post "${result.title}" has been created.`,
        { duration: 5000 }
      );

      router.push(`/topics/${result.topicSlug.current}/${result.slug.current}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.", {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto w-full p-6"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create a New Post</h1>
        <p className="text-muted-foreground">
          Share your pixel art, tutorial, or question with the community
        </p>
      </div>
      {/* Basic Fields */}
      <BasicFields topics={topics} setPostType={setPostType} />
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
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
