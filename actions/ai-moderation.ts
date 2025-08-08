"use server";

import { ModerationValue } from "@/constants";
import {
  checkPost,
  checkComment,
  checkUser,
  AIReportResult,
  AIResult,
  AITopicResult,
  checkTopicSuggestion,
} from "@/lib/ai/moderation-service";
import type { Report } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";

export const checkReportByAI = async (
  report: Report
): Promise<AIReportResult> => {
  if (!report?.reportedContent) {
    return { isViolating: false, confidence: 0 };
  }

  let result: AIReportResult;
  const content = report.reportedContent;

  switch (content._type) {
    case "post":
      result = await checkPost(content);
      break;
    case "comment":
      result = await checkComment(content);
      break;
    case "user":
      result = await checkUser(content);
      break;
    default:
      return { isViolating: false, confidence: 0 };
  }

  try {
    await writeReportAIResult(
      report,
      result.isViolating,
      result.reason,
      result.confidence
    );
  } catch (error) {
    console.error("Failed to save AI result:", error);
  }

  return result;
};

export const writeReportAIResult = async (
  report: Report,
  isViolating: boolean,
  reason: string | undefined,
  confidence: number
): Promise<void> => {
  if (!report || !report._id) {
    throw new Error("Invalid report data");
  }

  const {
    isViolating: prevIsViolating,
    reason: prevReason,
    confidence: prevConfidence,
  } = report.aiCheckResult || {};

  if (
    prevIsViolating === isViolating &&
    prevReason === reason &&
    prevConfidence === confidence
  )
    return;

  report.aiCheckResult = {
    _type: "aiCheckResult",
    isViolating,
    reason,
    confidence,
  };

  await writeAIResult(report._id, { aiCheckResult: report.aiCheckResult });
};

export const checkTopicSuggestionByAI = async (
  title: string,
  description: string
): Promise<AITopicResult> => {
  if (!title || !description) {
    throw new Error("Invalid title or description");
  }

  try {
    const aiResult = await checkTopicSuggestion(title, description);
    const recommendedAction = determineTopicAction(aiResult);
    return { ...aiResult, recommendedAction };
  } catch (error) {
    console.error("Topic suggestion AI check failed:", error);
    return {
      isApproved: false,
      suitabilityScore: 0,
      categories: [],
      reasons: ["AI moderation temporarily unavailable"],
      suggestions: [],
      confidence: 0,
      recommendedAction: "needs_human_review",
    };
  }
};

export const writeTopicSuggestionAIResult = async (
  contentId: string,
  aiResult: AITopicResult
): Promise<void> => {
  if (!contentId) {
    throw new Error("Invalid content ID");
  }

  await writeAIResult(contentId, { aiModerationResult: aiResult });
};

export const writeAIResult = async (
  contentId: string,
  result: AIResult
): Promise<void> => {
  if (!contentId) {
    throw new Error("Invalid content ID");
  }

  await writeClient.patch(contentId).set(result).commit();
};

const determineTopicAction = (aiResult: AITopicResult): ModerationValue => {
  const { isApproved, suitabilityScore, confidence, categories } = aiResult;

  if (
    isApproved &&
    suitabilityScore >= 0.8 &&
    confidence >= 0.85 &&
    !categories.includes("inappropriate")
  ) {
    return "published";
  }

  if (
    !isApproved &&
    (suitabilityScore < 0.3 ||
      categories.includes("inappropriate") ||
      confidence >= 0.8)
  ) {
    return "rejected";
  }

  return "needs_human_review";
};
