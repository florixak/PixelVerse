"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
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
import SubmitButton from "./submit-button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { REPORT_REASONS } from "@/constants";

type ReportFormProps = {
  content: Post | Comment | User | Topic;
  contentType: Report["contentType"];
  returnUrl?: string;
};

type InitialState = {
  error: string | null;
  success: boolean;
};

const initialState: InitialState = {
  error: null,
  success: false,
};

const ReportForm = ({
  content,
  contentType,
  returnUrl = "/",
}: ReportFormProps) => {
  const [reason, setReason] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleSubmit = async (
    prevState: InitialState,
    formData: FormData
  ): Promise<InitialState> => {
    const reasonValue = formData.get("reason") as string;
    const additionalInfoValue = formData.get("additionalInfo") as string;

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
  };

  const [state, formAction] = useActionState(handleSubmit, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }

    if (state?.success) {
      toast.success("Report submitted successfully!");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Link
        href={returnUrl}
        className="inline-flex items-center text-sm mb-6 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Link>

      <form
        ref={formRef}
        action={formAction}
        className="space-y-8 w-full p-6 border rounded-lg bg-card"
      >
        <h2 className="text-xl font-semibold">Report {contentDetails.title}</h2>

        {/* Content preview */}
        <div className="p-4 bg-muted rounded border">
          {contentDetails.author ? (
            <div className="text-sm text-muted-foreground mb-2">
              By {contentDetails.author}
            </div>
          ) : null}
          <div className="text-sm">{contentDetails.preview}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Reporting</Label>
          <Select
            name="reason"
            value={reason}
            onValueChange={setReason}
            required
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">
            {reason === "other"
              ? "Please specify (required)"
              : "Additional Information (optional)"}
          </Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={4}
            required={reason === "other"}
            className="w-full resize-none"
            placeholder={
              reason === "other"
                ? "Please provide details about the issue"
                : "Any additional context that might help us understand the issue"
            }
          />
        </div>

        <SubmitButton
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          label="Submit Report"
        />
      </form>
    </div>
  );
};

export default ReportForm;
