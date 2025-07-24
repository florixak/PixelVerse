"use client";

import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { suggestTopic } from "@/actions/topicActions";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const topicSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(150),
  icon: z
    .instanceof(File)
    .refine((file) => file.size <= 1 * 1024 * 1024, {
      message: "Icon image must be less than 1MB",
    })
    .optional(),
  banner: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Banner image must be less than 2MB",
    })
    .optional(),
});

type SuggestTopic = {
  title: string;
  description: string;
  icon?: File | null;
  banner?: File | null;
};

const TopicSuggestForm = () => {
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
        const formData = new FormData();
        formData.set("title", value.title);
        formData.set("description", value.description);
        if (value.icon) formData.set("icon", value.icon);
        if (value.banner) formData.set("banner", value.banner);

        const result = await suggestTopic(formData);
        if (result.success) {
          toast.success("Topic suggested successfully!");
          return true;
        } else {
          toast.error(result.error || "Failed to suggest topic");
          return false;
        }
      } catch (error) {
        console.error("Error suggesting topic:", error);
        toast.error("Failed to suggest topic. Please try again.");
        return false;
      }
    },
  });

  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8 max-w-4xl mx-auto w-full p-6"
    >
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

      <form.Field name="icon">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (optional)</Label>
            <Input
              id="icon"
              type="file"
              accept="image/*"
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

      <form.Field name="banner">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="banner">Banner (optional)</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
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
          })}
        >
          {({ isSubmitting }) => {
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
                <Button type="submit" disabled={isSubmitting}>
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
