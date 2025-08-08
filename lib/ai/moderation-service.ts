import { generateObject } from "ai";
import { AI_PROVIDERS } from "./provider";
import { AI_PROMPTS } from "./prompts";
import { moderationSchema, topicSuggestionSchema } from "./schema";
import { quickCheck } from "./content-filter";
import type { Comment, Post, User } from "@/sanity.types";
import { ModerationValue } from "@/constants";

export type AIReportResult = {
  isViolating: boolean;
  reason?: string;
  confidence: number;
  rateLimited?: boolean;
};

export type AITopicResult = {
  isApproved: boolean;
  suitabilityScore: number;
  categories: string[];
  reasons: string[];
  suggestions: string[];
  confidence: number;
  checkedAt?: string;
  recommendedAction?: ModerationValue;
};

export type AIResult =
  | { aiCheckResult: AIReportResult }
  | { aiModerationResult: AITopicResult };

const TOKEN_LIMITS = {
  post: 80,
  comment: 60,
  user: 70,
  topic: 80,
} as const;

export const callReportAI = async (
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 60,
  provider: keyof typeof AI_PROVIDERS = "gemini"
): Promise<AIReportResult> => {
  try {
    const model = AI_PROVIDERS[provider];
    if (!model) {
      console.log(`❌ ${provider} not available for report check`);
      return {
        isViolating: false,
        reason: "AI provider not available",
        confidence: 0,
      };
    }

    console.log(`🤖 Using ${provider} for report check...`);

    const { object, usage } = await generateObject({
      model,
      schema: moderationSchema,
      system: `${AI_PROMPTS.system.base}\n${systemPrompt}`,
      prompt: userPrompt,
      maxTokens,
      temperature: 0.1,
    });

    console.log(
      `✅ ${provider} report check completed:`,
      usage?.totalTokens || 0
    );

    return {
      isViolating: Boolean(object.isViolating),
      reason: object.reason || undefined,
      confidence: Math.min(Math.max(Number(object.confidence) || 0, 0), 1),
    };
  } catch (error) {
    console.log(`❌ ${provider} report check failed:`, error);

    return createReportFallback(userPrompt, error as Error);
  }
};

export const callTopicAI = async (
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 80,
  provider: keyof typeof AI_PROVIDERS = "gemini"
): Promise<AITopicResult> => {
  try {
    const model = AI_PROVIDERS[provider];
    if (!model) {
      console.log(`❌ ${provider} not available for topic check`);
      return createTopicFallback(
        userPrompt,
        new Error("Provider not available")
      );
    }

    console.log(`🤖 Using ${provider} for topic check...`);

    const { object, usage } = await generateObject({
      model,
      schema: topicSuggestionSchema,
      system: `${AI_PROMPTS.system.base}\n${systemPrompt}`,
      prompt: userPrompt,
      maxTokens,
      temperature: 0.1,
    });

    console.log(
      `✅ ${provider} topic check completed:`,
      usage?.totalTokens || 0
    );

    return {
      isApproved: Boolean(object.isApproved),
      suitabilityScore: Math.min(
        Math.max(Number(object.suitabilityScore) || 0, 0),
        1
      ),
      categories: Array.isArray(object.categories)
        ? object.categories
        : ["needs_review"],
      reasons: Array.isArray(object.reasons)
        ? object.reasons
        : ["AI analysis completed"],
      suggestions: Array.isArray(object.suggestions) ? object.suggestions : [],
      confidence: Math.min(Math.max(Number(object.confidence) || 0, 0), 1),
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.log(`❌ ${provider} topic check failed:`, error);

    return createTopicFallback(userPrompt, error as Error);
  }
};

const createReportFallback = (
  userPrompt: string,
  error: Error
): AIReportResult => {
  const content = userPrompt.toLowerCase();

  const severeWords = [
    "hate",
    "nazi",
    "kill",
    "die",
    "fuck you",
    "racist",
    "sexist",
  ];
  const hasSevere = severeWords.some((word) => content.includes(word));

  if (hasSevere) {
    return {
      isViolating: true,
      reason: "Contains potentially harmful content (detected by fallback)",
      confidence: 0.7,
    };
  }

  return {
    isViolating: false,
    reason: `AI temporarily unavailable: ${error.message.substring(0, 50)}`,
    confidence: 0.3,
  };
};

const createTopicFallback = (
  userPrompt: string,
  error: Error
): AITopicResult => {
  const content = userPrompt.toLowerCase();

  const violations = ["hate", "spam", "nsfw", "adult", "porn"];
  const hasViolation = violations.some((word) => content.includes(word));

  if (hasViolation) {
    return {
      isApproved: false,
      suitabilityScore: 0.1,
      categories: ["inappropriate"],
      reasons: ["Contains inappropriate content (detected by fallback)"],
      suggestions: [
        "Please suggest topics related to pixel art and creativity",
      ],
      confidence: 0.8,
      checkedAt: new Date().toISOString(),
    };
  }

  const pixelKeywords = [
    "pixel",
    "art",
    "sprite",
    "8bit",
    "16bit",
    "retro",
    "game",
    "animation",
  ];
  const matches = pixelKeywords.filter((word) => content.includes(word)).length;
  const score = Math.min(matches * 0.12, 0.6);

  return {
    isApproved: score >= 0.4,
    suitabilityScore: score,
    categories: score >= 0.4 ? ["art_design"] : ["off_topic"],
    reasons: [
      `AI temporarily unavailable - using keyword analysis`,
      `Found ${matches} relevant keywords (${Math.round(
        score * 100
      )}% relevance)`,
      `Error: ${error.message.substring(0, 80)}`,
    ],
    suggestions:
      score < 0.4
        ? ["Include pixel art terms like 'pixel art', 'sprites', '8-bit'"]
        : [],
    confidence: 0.4,
    checkedAt: new Date().toISOString(),
  };
};

export const checkPost = async (post: Post): Promise<AIReportResult> => {
  if (!post?.content) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(post.content as string)) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  return callReportAI(
    AI_PROMPTS.system.report.post,
    AI_PROMPTS.user.post(post),
    TOKEN_LIMITS.post
  );
};

export const checkComment = async (
  comment: Comment
): Promise<AIReportResult> => {
  if (!comment?.content) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(comment.content)) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  return callReportAI(
    AI_PROMPTS.system.report.comment,
    AI_PROMPTS.user.comment(comment),
    TOKEN_LIMITS.comment
  );
};

export const checkUser = async (user: User): Promise<AIReportResult> => {
  if (!user?.username) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(user.username) || quickCheck(user.bio || "")) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  return callReportAI(
    AI_PROMPTS.system.report.user,
    AI_PROMPTS.user.user(user),
    TOKEN_LIMITS.user
  );
};

export const checkTopicSuggestion = async (
  title: string,
  description: string = ""
): Promise<AITopicResult> => {
  if (!title?.trim()) {
    return {
      isApproved: false,
      suitabilityScore: 0,
      categories: ["invalid"],
      reasons: ["Title is required"],
      suggestions: ["Please provide a topic title"],
      confidence: 1,
      checkedAt: new Date().toISOString(),
    };
  }

  if (quickCheck(title) || quickCheck(description)) {
    return {
      isApproved: false,
      suitabilityScore: 0,
      categories: ["inappropriate"],
      reasons: ["Contains inappropriate language"],
      suggestions: ["Please suggest family-friendly pixel art topics"],
      confidence: 0.9,
      checkedAt: new Date().toISOString(),
    };
  }

  return callTopicAI(
    AI_PROMPTS.system.topic.base,
    AI_PROMPTS.user.topic(title, description),
    TOKEN_LIMITS.topic
  );
};
