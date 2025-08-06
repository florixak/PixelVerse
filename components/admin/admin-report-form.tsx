"use client";

import { handleReportAction, ReportAction } from "@/actions/adminActions";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Report, User } from "@/sanity.types";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import { checkReportByAI, writeReportAIResult } from "@/actions/ai-moderation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { AIReportResult } from "@/lib/ai/moderation-service";

type AdminReportFormProps = {
  report: Report;
  onActionComplete?: () => void;
  userId?: User["clerkId"];
};

type ReportFormData = {
  notes: string;
  action: ReportAction;
  aiResult?: AIReportResult | null;
  isAIChecking?: boolean;
};

const AdminReportForm = ({
  report,
  onActionComplete,
  userId,
}: AdminReportFormProps) => {
  const form = useForm({
    defaultValues: {
      notes: "",
      action: null,
      aiResult: report.aiCheckResult || null,
      isAIChecking: false,
    } as ReportFormData,
    onSubmit: async ({ value }) => {
      try {
        if (value.action === "aiChecking") {
          return await handleAICheck();
        }

        if (!report || !report._id) {
          toast.error("Report ID is required for processing actions.");
          return;
        }

        const result = await handleReportAction(
          report._id,
          value.action,
          value.notes || undefined
        );

        if (result.success) {
          toast.success(
            `Report ${
              value.action === "resolved" ? "resolved" : "rejected"
            } successfully`
          );
          if (onActionComplete) onActionComplete();
        } else {
          toast.error(result.message || "Failed to process report action");
        }
      } catch (error) {
        toast.error(
          `Error processing report action: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  const handleAICheck = async () => {
    if (!userId) {
      toast.error("User ID is required for AI moderation check.");
      return;
    }

    form.setFieldValue("isAIChecking", true);

    try {
      const { isViolating, reason, confidence } = await checkReportByAI(
        report,
        {
          userId,
        }
      );

      const aiResult = {
        isViolating,
        reason: reason || undefined,
        confidence,
      };

      form.setFieldValue("aiResult", aiResult);
      await writeReportAIResult(report, isViolating, reason, confidence);

      toast.success(
        `AI moderation check completed: ${
          isViolating ? "Violation detected" : "No violation"
        }`
      );
    } catch (error) {
      toast.error(
        `Error processing AI moderation check: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      form.setFieldValue("isAIChecking", false);
    }
  };

  if (!report || report.status !== "pending") return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.Field
        name="notes"
        validators={{
          onChange: ({ value }) => {
            if (value.length > 1000) {
              return "Notes must be 1000 characters or less";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div>
            <Textarea
              placeholder="Add notes explaining your decision (visible to other moderators)"
              className="min-h-[100px]"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />

            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center ${
                field.state.meta.errors.length > 0
                  ? "justify-between"
                  : "justify-end"
              } mt-1`}
            >
              {field.state.meta.errors.length > 0 && (
                <div className="text-sm text-red-500">
                  {field.state.meta.errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-1">
                {field.state.value.length}/1000 characters
              </div>
            </div>
          </div>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          values: state.values,
          isValid: state.isValid,
        })}
      >
        {({ isSubmitting, isValid, values }) => (
          <div className="flex gap-2 justify-end items-center flex-col sm:flex-row">
            <div className="flex items-center gap-2 flex-col sm:flex-row">
              <AIReportInfo aiResult={values.aiResult} />
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  form.setFieldValue("action", "aiChecking");
                  form.handleSubmit();
                }}
                disabled={
                  isSubmitting ||
                  values.action === "resolved" ||
                  values.isAIChecking
                }
              >
                {isSubmitting && values.isAIChecking
                  ? "Checking with AI..."
                  : "Check with AI"}
              </Button>
            </div>

            <Button
              id="reject-report"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                form.setFieldValue("action", "rejected");
                form.handleSubmit();
              }}
              disabled={
                isSubmitting || values.action === "resolved" || !isValid
              }
            >
              {isSubmitting && values.action === "rejected"
                ? "Rejecting..."
                : "Reject Report"}
            </Button>

            <Button
              id="resolve-report"
              onClick={(e) => {
                e.preventDefault();
                form.setFieldValue("action", "resolved");
                form.handleSubmit();
              }}
              disabled={
                isSubmitting || values.action === "rejected" || !isValid
              }
            >
              {isSubmitting && values.action === "resolved"
                ? "Resolving..."
                : "Resolve Report"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
};

const AIReportInfo = ({
  aiResult,
}: {
  aiResult: AIReportResult | null | undefined;
}) => {
  const hasAIResult = aiResult && aiResult.isViolating !== undefined;

  const getTooltipContent = () => {
    if (!hasAIResult) {
      return "No AI analysis yet. Click 'Check with AI' to get automated content review.";
    }

    const verdict = aiResult.isViolating
      ? "VIOLATION DETECTED"
      : "NO VIOLATION";
    const confidence = Math.round(aiResult.confidence * 100);
    const reason = aiResult.reason || "No specific reason provided";

    return (
      <div className="space-y-1">
        <div className="font-semibold text-base">
          🤖 AI Verdict:{" "}
          <span
            className={aiResult.isViolating ? "text-red-300" : "text-green-300"}
          >
            {verdict}
          </span>
        </div>
        <p className="text-base">
          📊 Confidence: <span className="font-semibold">{confidence}%</span>
        </p>
        <p className="text-base">
          💭 Reason: <span className="font-semibold">{reason}</span>
        </p>
      </div>
    );
  };

  const getIconStyle = () => {
    if (!hasAIResult) return "text-gray-500";
    return aiResult.isViolating ? "text-red-500" : "text-green-500";
  };

  const getStatusText = () => {
    if (!hasAIResult) return "No AI Check";
    if (aiResult.isViolating) return "AI: Violation";
    return "AI: Clean";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 cursor-help">
          <Info
            className={getIconStyle()}
            size={16}
            aria-label="AI Check Result"
          />
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-lg bg-muted text-muted-foreground p-3 rounded-lg shadow-lg">
        {getTooltipContent()}
      </TooltipContent>
    </Tooltip>
  );
};

export default AdminReportForm;
