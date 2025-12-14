"use client";

import { Comment, Post, Report, Topic, User } from "@/sanity.types";
import { submitReport } from "@/actions/post-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { REPORT_REASONS } from "@/constants";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BackButton from "../ui/back-button";

type ReportFormProps = {
  content: Post | Comment | User | Topic;
  contentType: Report["contentType"];
  returnUrl?: string;
};

type ReportData = {
  reason: Report["reason"] | string;
  additionalInfo?: string;
};

const reasons = REPORT_REASONS.map((r) => r.value);

const reportSchema = z
  .object({
    reason: z.enum(["", ...reasons] as const).refine((value) => value !== "", {
      message: "Please select a reason for reporting",
    }),
    additionalInfo: z
      .string()
      .max(500, "Additional info must be less than 500 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.reason === "other" && !data.additionalInfo?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details when selecting 'Other'",
        path: ["additionalInfo"],
      });
    }
  });

const ReportForm = ({ content, contentType }: ReportFormProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      reason: "",
      additionalInfo: "",
    } as ReportData,
    onSubmit: async ({ value }) => {
      const reasonValue = value.reason;
      const additionalInfoValue = value.additionalInfo || "";

      try {
        if (!reasonValue) {
          toast.error("Please select a reason for reporting.");
          return;
        }

        const validationResult = reportSchema.parse(value);

        const response = await submitReport(
          content._id,
          validationResult.reason as Report["reason"],
          validationResult.additionalInfo as Report["additionalInfo"],
          contentType
        );

        if (response.success) {
          toast.success("Report submitted successfully!");
          router.push(`/my-reports/${response.reportId}`);
        } else {
          toast.error(response.error || "Failed to submit report");
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            toast.error(err.message);
          });
        } else {
          console.error("Error submitting report:", error);
          toast.error("Failed to submit report. Please try again later.");
        }
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
    <div className="relative max-w-xl mx-auto mt-6">
      <BackButton className="absolute top-4 -left-24" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8 w-full p-6 border rounded-lg bg-card"
      >
        <h2 className="text-xl font-semibold">Report {contentDetails.title}</h2>

        <div className="p-4 bg-muted rounded border">
          {contentDetails.author ? (
            <div className="text-sm text-muted-foreground mb-2">
              By {contentDetails.author}
            </div>
          ) : null}
          <div className="text-sm">{contentDetails.preview}</div>
        </div>
        <form.Field
          name="reason"
          validators={{
            onBlur: ({ value }) => {
              if (!value || value === "") {
                return "Please select a reason for reporting";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Reporting</Label>
              <Select
                name="reason"
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as Report["reason"])
                }
              >
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
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500 mt-1">
                  {field.state.meta.errors.map((error, index) => (
                    <div key={index}>
                      {typeof error === "string"
                        ? error
                        : JSON.stringify(error)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="additionalInfo"
          validators={{
            onChange: ({ value, fieldApi }) => {
              const reason = fieldApi.form.state.values.reason;

              if (reason === "other" && (!value || !value.trim())) {
                return "Please provide details when selecting 'Other'";
              }

              return undefined;
            },
          }}
        >
          {(field) => (
            <form.Subscribe
              selector={(state) => ({
                reason: state.values.reason,
              })}
            >
              {({ reason }) => (
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">
                    {reason === "other"
                      ? "Please specify (required)"
                      : "Additional Information (optional)"}
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={5}
                    className="w-full resize-none"
                    placeholder={
                      reason === "other"
                        ? "Please provide details about the issue"
                        : "Any additional context that might help us understand the issue"
                    }
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors.map((error, index) => (
                        <div key={index}>
                          {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form.Subscribe>
          )}
        </form.Field>
        <div className="flex justify-end">
          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              isValid: state.isValid,
            })}
          >
            {({ isSubmitting, isValid }) => (
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
