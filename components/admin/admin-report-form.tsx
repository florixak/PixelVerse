"use client";

import { useState } from "react";
import { handleReportAction } from "@/actions/adminActions";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Report, User } from "@/sanity.types";
import toast from "react-hot-toast";
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
  const [notes, setNotes] = useState("");
  const [aiResult, setAIResult] = useState<AIReportResult | null>(
    report.aiCheckResult || null
  );

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

  const handleAction = async (action: "resolved" | "rejected") => {
    setIsSubmitting(true);

    try {
      const result = await handleReportAction(
        report._id,
        action,
        notes || undefined
      );

      if (result.success) {
        toast.success(
          action === "resolved"
            ? "Report resolved successfully"
            : "Report rejected successfully"
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
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Optional: Add notes explaining your decision (visible to other moderators)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[100px]"
      />

      {report.status === "pending" && (
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
            variant="outline"
            onClick={() => handleAction("rejected")}
            disabled={isSubmitting}
          >
            Reject Report
          </Button>
          <Button
            onClick={() => handleAction("resolved")}
            disabled={isSubmitting}
          >
            Resolve Report
          </Button>
        </div>
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
