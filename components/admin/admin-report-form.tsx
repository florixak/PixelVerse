"use client";

import { useState } from "react";
import { handleReportAction, ReportAction } from "@/actions/adminActions";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Report, User } from "@/sanity.types";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";
import {
  AIReportResult,
  checkReportByAI,
  writeReportAIResult,
} from "@/actions/ai-moderation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";

type AdminReportFormProps = {
  report: Report;
  onActionComplete?: () => void;
  userId?: User["clerkId"];
};

const AdminReportForm = ({
  report,
  onActionComplete,
  userId,
}: AdminReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAction, setCurrentAction] = useState<ReportAction>(null);
  const [aiResult, setAIResult] = useState<AIReportResult | null>(
    report.aiCheckResult || null
  );
  const form = useForm({
    defaultValues: { notes: "" } as { notes: string },
    onSubmit: async ({ value }) => {
      try {
        const result = await handleReportAction(
          report._id,
          currentAction,
          value.notes || undefined
        );

        if (result.success) {
          toast.success(
            `Report ${
              currentAction === "resolved" ? "resolved" : "rejected"
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
      } finally {
        setIsSubmitting(false);
        setCurrentAction(null);
      }
    },
  });

  if (!report) return null;

  const handleAIAction = async () => {
    setIsSubmitting(true);
    try {
      const { isViolating, reason, confidence } = await checkReportByAI(
        report,
        userId
      );

      setAIResult({ isViolating, reason, confidence });
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
      setIsSubmitting(false);
    }
  };

  const handleResolveAction = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentAction("resolved");
    form.handleSubmit();
  };

  const handleRejectAction = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentAction("rejected");
    form.handleSubmit();
  };

  return (
    <div className="space-y-4">
      {report.status === "pending" && (
        <>
          <form.Field name="notes">
            {(field) => (
              <Textarea
                placeholder="Add notes explaining your decision (visible to other moderators)"
                className="min-h-[100px]"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <div className="flex gap-2 justify-end items-center flex-col sm:flex-row">
            <div className="flex items-center gap-2 flex-col sm:flex-row">
              <AIReportInfo aiResult={aiResult} />
              <Button
                variant="secondary"
                onClick={handleAIAction}
                disabled={isSubmitting}
              >
                Check with AI
              </Button>
            </div>

            <Button
              id="reject-report"
              variant="outline"
              onClick={handleRejectAction}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting && currentAction === "rejected"
                ? "Rejecting..."
                : "Reject Report"}
            </Button>

            <Button
              id="resolve-report"
              onClick={handleResolveAction}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting && currentAction === "resolved"
                ? "Resolving..."
                : "Resolve Report"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const AIReportInfo = ({ aiResult }: { aiResult: AIReportResult | null }) => {
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
