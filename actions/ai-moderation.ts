"use server";

import { Comment, Post, Report, User } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const isGoogle = process.env.AI_OPTION === "google";

const openai = isGoogle
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })
  : createOpenAI({
      compatibility: "strict",
      apiKey: process.env.OPENAI_API_KEY,
    });

export type AIReportResult = {
  isViolating: boolean;
  reason?: string;
  confidence: number;
  rateLimited?: boolean;
};

const tokenLimits = {
  post: 80,
  comment: 60,
  user: 70,
};

const AI_PROVIDERS = {
  openai: openai("gpt-3.5-turbo"),
  gemini: google("gemini-1.5-flash"),
} as const;

const AI_MODERATION_PROMPTS = {
  system: {
    base: `Content moderator for PixelVerse pixel art community. 
    Analyze content for violations. Respond with:
    {"isViolating": boolean, "reason": string, "confidence": number}
    Confidence: 0-1 scale.`,
    post: `You are moderating posts in a pixel art community. Check for:
    - Hate speech or harassment
    - Spam or irrelevant content
    - Adult/NSFW content
    - Copyright infringement claims
    - Off-topic content (non-pixel art related)
    - Malicious links or phishing
    
    Be lenient with creative expression but strict with harmful content.`,

    comment: `You are moderating comments in a pixel art community. Check for:
    - Harassment or personal attacks
    - Hate speech or discrimination
    - Spam or promotional content
    - Trolling or inflammatory remarks
    - Doxxing or privacy violations
    
    Allow constructive criticism and creative feedback.`,

    user: `You are moderating user profiles in a pixel art community. Check for:
    - Offensive or inappropriate usernames
    - Hateful or discriminatory bio content
    - Impersonation of public figures
    - Promotional spam in bio
    - Contact information that might be unsafe
    
    Allow creative usernames and personal expression within reason.`,
  },
  user: {
    post: (post: Post) => `
    Analyze this pixel art post:
    
    Title: "${post.title || "Untitled"}"
    Content: "${post.content || ""}"
    Tags: ${post.tags?.join(", ") || "none"}
    
    Is this post violating community guidelines?`,

    comment: (comment: Comment) => `
    Analyze this comment:
    
    Comment: "${comment.content || ""}"
    Author: ${comment.author?.fullName || "unknown"}
    
    Is this comment violating community guidelines?`,

    user: (user: User) => `
    Analyze this user profile:
    
    Username: "${user.username || ""}"
    Full Name: "${user.fullName || ""}"
    Bio: "${user.bio || ""}"
    Email: "${user.email || ""}"
    
    Is this profile violating community guidelines?`,
  },
} as const;

const moderationSchema = z.object({
  isViolating: z.boolean(),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
});

const rateLimiter = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (
  userId: string,
  maxCalls: number = 5,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxCalls) {
    return false; // Rate limited
  }

  userLimit.count++;
  return true;
};

const callAI = async (
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 60,
  provider: keyof typeof AI_PROVIDERS = "gemini"
): Promise<AIReportResult> => {
  try {
    if (!AI_PROVIDERS[provider]) {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }
    const model = AI_PROVIDERS[provider];
    if (!model) {
      throw new Error("AI model not initialized");
    }

    const { object, usage } = await generateObject({
      model,
      schema: moderationSchema,
      system: `${AI_MODERATION_PROMPTS.system.base}\n${systemPrompt}`,
      prompt: userPrompt,
      maxTokens,
      temperature: 0.1,
    });

    console.log(`📊 Tokens used: ${usage?.completionTokens}/${maxTokens}`);
    console.log(`🎯 Decision: ${object.isViolating ? "VIOLATION" : "CLEAN"}`);
    console.log(`📈 Confidence: ${Math.round(object.confidence * 100)}%`);

    return {
      isViolating: object.isViolating,
      reason: object.reason,
      confidence: Math.min(Math.max(object.confidence, 0), 1),
    };
  } catch (error) {
    console.error("AI moderation error:", error);
    return {
      isViolating: false,
      reason: "AI moderation service temporarily unavailable",
      confidence: 0,
    };
  }
};

const quickCheck = (content: string): boolean => {
  const flaggedWords = [
    "spam",
    "scam",
    "hate",
    "fuck",
    "shit",
    "asshole",
    "bitch",
    "idiot",
    "stupid",
    "dumb",
    "loser",
    "kill",
    "die",
    "nazi",
    "retard",
    "fag",
    "nigger",
    "cunt",
    "whore",
    "slut",
  ];

  const lowerContent = content.toLowerCase();

  return flaggedWords.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lowerContent);
  });
};

export const checkReportByAI = async (
  report: Report,
  userId?: User["clerkId"]
): Promise<AIReportResult> => {
  if (!report || !report.reportedContent) {
    return { isViolating: false, confidence: 0 };
  }

  if (userId && !checkRateLimit(userId, 3, 60000)) {
    console.log(
      `Rate limit exceeded for user ${userId} on report ${
        report.displayId || report._id
      }`
    );
    return {
      isViolating: false,
      reason: "Rate limit exceeded",
      confidence: 0,
      rateLimited: true,
    };
  }

  const content = report.reportedContent;

  if (content._type === "post") {
    return checkPostByAI(content);
  } else if (content._type === "comment") {
    return checkCommentByAI(content);
  } else if (content._type === "user") {
    return checkUserByAI(content);
  }

  return { isViolating: false, confidence: 0 };
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

  await writeClient
    .patch(report._id)
    .set({ aiCheckResult: report.aiCheckResult })
    .commit();
};

const checkPostByAI = async (post: Post): Promise<AIReportResult> => {
  if (!post || !post.content) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(post.content as string)) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  return callAI(
    AI_MODERATION_PROMPTS.system.post,
    AI_MODERATION_PROMPTS.user.post(post),
    tokenLimits.post
  );
};

const checkCommentByAI = async (
  comment: Comment
): Promise<{
  isViolating: boolean;
  reason?: string;
  confidence: number;
}> => {
  if (!comment || !comment.content) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(comment.content)) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  return callAI(
    AI_MODERATION_PROMPTS.system.comment,
    AI_MODERATION_PROMPTS.user.comment(comment),
    tokenLimits.comment
  );
};

const checkUserByAI = async (user: User): Promise<AIReportResult> => {
  if (!user || !user.username) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(user.username) || quickCheck(user.bio || "")) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  return callAI(
    AI_MODERATION_PROMPTS.system.user,
    AI_MODERATION_PROMPTS.user.user(user),
    tokenLimits.user
  );
};
