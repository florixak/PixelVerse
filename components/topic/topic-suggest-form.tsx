"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { suggestTopic } from "@/actions/topic-suggestion-actions";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import TopicSuggestionResult, {
  TopicSuggestionResultData,
} from "./topic-suggestion-result";

const topicSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100)
    .refine((val) => val.trim() !== "", {
      message: "Title cannot be empty",
    }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(150)
    .refine((val) => val.trim() !== "", {
      message: "Description cannot be empty",
    }),
  icon: z.instanceof(File).refine((file) => file.size <= 1 * 1024 * 1024, {
    message: "Icon image must be less than 1MB",
  }),
  banner: z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Banner image must be less than 2MB",
  }),
});

type SuggestTopic = {
  title: string;
  description: string;
  icon: File | null;
  banner: File | null;
};

const TopicSuggestForm = () => {
  const router = useRouter();
  const [result, setResult] = useState<TopicSuggestionResultData | null>(null);
  const [rejectedSuggestionId, setRejectedSuggestionId] = useState<
    string | null
  >(null);
  const [fileInputsKey, setFileInputsKey] = useState(0);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      icon: null,
      banner: null,
    } as SuggestTopic,
    validators: {
      onChange: topicSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setResult(null);

        const formData = new FormData();
        formData.set("title", value.title);
        formData.set("description", value.description);
        if (value.icon) formData.set("icon", value.icon);
        if (value.banner) formData.set("banner", value.banner);
        if (rejectedSuggestionId) {
          formData.set("previousSuggestionId", rejectedSuggestionId);
        }

        const response = await suggestTopic(formData);
        if (!response.success) {
          toast.error(response.error || "Failed to suggest topic");
          return;
        }

        if (response.status === "published" && response.slug) {
          setRejectedSuggestionId(null);
          toast.success(
            `Topic published successfully! Your topic "${response.title}" is now live.`,
            { duration: 5000 },
          );
          router.push(`/topics/${response.slug}`);
          return;
        }

        if (
          response.status === "rejected" ||
          response.status === "needs_human_review"
        ) {
          if (response.status === "rejected" && response.id) {
            setRejectedSuggestionId(response.id);
          } else {
            setRejectedSuggestionId(null);
          }

          setResult({
            status: response.status,
            id: response.id,
            title: response.title,
            reasons: response.reasons,
            suggestions: response.suggestions,
          });
          return;
        }

        toast.success("Topic suggested successfully!");
      } catch (error) {
        console.error("Error suggesting topic:", error);
        toast.error("Failed to suggest topic. Please try again.");
      }
    },
  });

  const handleSuggestAnother = () => {
    setResult(null);
    setRejectedSuggestionId(null);
    form.reset();
    setFileInputsKey((key) => key + 1);
  };

  if (result?.status === "needs_human_review") {
    return (
      <div className="max-w-4xl mx-auto w-full p-6">
        <TopicSuggestionResult
          result={result}
          onSuggestAnother={handleSuggestAnother}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8 max-w-4xl mx-auto w-full p-6"
    >
      {result?.status === "rejected" && (
        <TopicSuggestionResult result={result} />
      )}

      <form.Field name="title">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
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

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the topic in detail (max 150 characters)"
              rows={3}
              className="resize-none"
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

      <form.Field name="icon" key={`icon-${fileInputsKey}`}>
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              type="file"
              accept="image/*"
              placeholder="Upload an icon image (max 1MB)"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                field.handleChange(file);
              }}
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

      <form.Field name="banner" key={`banner-${fileInputsKey}`}>
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="banner">Banner</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              placeholder="Upload a banner image (max 2MB)"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                field.handleChange(file);
              }}
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

      <div className="flex justify-end space-x-4">
        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            isValid: state.isValid,
          })}
        >
          {({ isSubmitting, isValid }) => {
            return (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Suggest Topic"
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

export default TopicSuggestForm;
