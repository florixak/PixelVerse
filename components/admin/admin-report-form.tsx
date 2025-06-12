"use client";

import { useState } from "react";
import { handleReportAction } from "@/actions/adminActions";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Report } from "@/sanity.types";
import toast from "react-hot-toast";

interface AdminReportFormProps {
  report: Report;
  onActionComplete?: () => void;
}

const AdminReportForm = ({
  report,
  onActionComplete,
}: AdminReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

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
        <div className="flex gap-2 justify-end">
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

export default AdminReportForm;
