"use server";

import {
  checkPost,
  checkComment,
  checkUser,
  AIReportResult,
  AIResult,
  AITopicResult,
  checkTopicSuggestion,
} from "@/lib/ai/moderation-service";
import { rateLimiter } from "@/lib/ai/rate-limiter";
import type { Report, User } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";

export const checkReportByAI = async (
  report: Report,
  options: {
    userId?: User["clerkId"];
    forceRecheck?: boolean;
    checkReason?: string;
  } = {}
): Promise<AIReportResult> => {
  const {
    userId,
    forceRecheck = false,
    checkReason = "manual_request",
  } = options;

  if (!report?.reportedContent) {
    return { isViolating: false, confidence: 0 };
  }

  if (userId && !rateLimiter.check(userId, 3, 60000)) {
    console.log(`⏰ Rate limit exceeded for user ${userId}`);
    return {
      isViolating: false,
      reason: "Rate limit exceeded",
      confidence: 0,
      rateLimited: true,
    };
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
    return await checkTopicSuggestion(title, description);
  } catch (error) {
    console.error("Topic suggestion AI check failed:", error);
    return {
      isApproved: false,
      suitabilityScore: 0,
      categories: [],
      reasons: ["AI moderation temporarily unavailable"],
      suggestions: [],
      confidence: 0,
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
