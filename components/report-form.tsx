"use client";

import { Comment, Post, Report, Topic, User } from "@/sanity.types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { submitReport } from "@/actions/postActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { REPORT_REASONS } from "@/constants";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

type ReportFormProps = {
  content: Post | Comment | User | Topic;
  contentType: Report["contentType"];
  returnUrl?: string;
};

type ReportData = {
  reason: string;
  additionalInfo?: string;
};

const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason for reporting"),
  additionalInfo: z
    .string()
    .max(500, "Additional info must be less than 500 characters")
    .optional(),
});

const ReportForm = ({
  content,
  contentType,
  returnUrl = "/",
}: ReportFormProps) => {
  const form = useForm({
    defaultValues: {
      reason: "",
      additionalInfo: "",
    } as ReportData,
    validators: {
      onChange: reportSchema,
    },
    onSubmit: async (values) => {
      const reasonValue = values.value.reason;
      const additionalInfoValue = values.value.additionalInfo || "";

      if (!reasonValue) {
        return {
          error: "Please select a reason for reporting",
          success: false,
        };
      }

      if (reasonValue === "other" && !additionalInfoValue.trim()) {
        return {
          error: "Please provide details when selecting 'Other'",
          success: false,
        };
      }

      try {
        const response = await submitReport(
          content._id,
          reasonValue as Report["reason"],
          additionalInfoValue,
          contentType
        );

        return response;
      } catch (error) {
        console.error("Error submitting report:", error);
        return {
          error: "Failed to submit report. Please try again.",
          success: false,
        };
      }
    },
  });

  const getContentDetails = () => {
    switch (contentType) {
      case "post":
        const post = content as Post;
        return {
          title: post?.title,
          preview: post?.excerpt,
          author: post?.author?.username,
        };
      case "comment":
        const comment = content as Comment;
        return {
          title: `Comment on "${comment.post?.title}"`,
          preview: comment.content,
          author: comment.author?.username,
        };
      case "user":
        const user = content as User;
        return {
          title: `User: ${user.username}`,
          preview: user.bio || "User profile",
          author: user.username,
        };
      default:
        return { title: "Unknown content", preview: "", author: "" };
    }
  };

  const contentDetails = getContentDetails();

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Link
        href={returnUrl}
        className="inline-flex items-center text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Link>

      <form className="space-y-8 w-full p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold">Report {contentDetails.title}</h2>

        <div className="p-4 bg-muted rounded border">
          {contentDetails.author ? (
            <div className="text-sm text-muted-foreground mb-2">
              By {contentDetails.author}
            </div>
          ) : null}
          <div className="text-sm">{contentDetails.preview}</div>
        </div>
        <form.Field name="reason">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Reporting</Label>
              <Select name="reason" value={field.state.value} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field name="additionalInfo">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">
                {field.state.value === "other"
                  ? "Please specify (required)"
                  : "Additional Information (optional)"}
              </Label>
              <Textarea
                id="additionalInfo"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={4}
                required={field.state.value === "other"}
                className="w-full resize-none"
                placeholder={
                  field.state.value === "other"
                    ? "Please provide details about the issue"
                    : "Any additional context that might help us understand the issue"
                }
              />
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ isSubmitting }) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default ReportForm;
