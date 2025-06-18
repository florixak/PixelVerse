"use client";

import SubmitButton from "../submit-button";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { suggestTopic } from "@/actions/topicActions";
import { useRouter } from "next/navigation";

const TopicSuggestForm = () => {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      const result = await suggestTopic(formData);

      if (!result.success) {
        toast.error(result.error || "Failed to suggest topic", {
          duration: 5000,
        });
        return;
      }

      toast.success(
        `Topic "${formData.get("title")}" suggested successfully!`,
        {
          duration: 5000,
        }
      );

      router.push(`/topics`);
    } catch (error) {
      console.error("Error suggesting topic:", error);
      toast.error("Failed to suggest topic. Please try again.", {
        duration: 5000,
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto w-full p-6"
    >
      <div>
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={100}
          placeholder="Enter a descriptive title"
        />
      </div>
      <div>
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          maxLength={150}
          placeholder="Describe the topic in detail (max 150 characters)"
          rows={3}
          className="resize-none"
        />
      </div>
      <div>
        <Label htmlFor="image">Upload topic icon</Label>
        <span className="text-sm text-muted-foreground">
          Recommended size: 64x64 pixels and max 1MB
        </span>
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>
      <div>
        <Label htmlFor="image">Upload topic banner</Label>
        <span className="text-sm text-muted-foreground">
          Recommended size: 1200x600 pixels and max 2MB
        </span>
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <SubmitButton
          label="Suggest Topic"
          submittingLabel="Suggesting Topic..."
        />
      </div>
    </form>
  );
};

export default TopicSuggestForm;
