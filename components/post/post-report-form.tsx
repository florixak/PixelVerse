"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import SubmitButton from "../submit-button";
import { toast } from "react-hot-toast";
import { reportPost } from "@/actions/postActions";
import { REPORT_REASONS } from "@/lib/constants";
import { Post } from "@/sanity.types";

type PostReportFormProps = {
  post: Post;
};

type InitialState = {
  error: string | null;
  success: boolean;
};

const initialState: InitialState = {
  error: null,
  success: false,
};

const PostReportForm = ({ post }: PostReportFormProps) => {
  const [reason, setReason] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

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
      const response = await reportPost(
        post._id,
        reasonValue,
        additionalInfoValue
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
      toast.success("Comment posted successfully!");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-8 max-w-xl mx-auto w-full p-6"
    >
      <h2 className="text-lg font-semibold">Reporting post {post.title}</h2>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Reporting</Label>
        <Select name="reason" value={reason} onValueChange={setReason} required>
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
  );
};

export default PostReportForm;
