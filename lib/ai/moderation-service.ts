import { generateObject } from "ai";
import { AI_PROVIDERS } from "./provider";
import { AI_PROMPTS } from "./prompts";
import { moderationSchema } from "./schema";
import { quickCheck } from "./content-filter";
import type { Comment, Post, SuggestedTopic, User } from "@/sanity.types";

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
};

const TOKEN_LIMITS = {
  post: 80,
  comment: 60,
  user: 70,
} as const;

export const callAI = async (
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 60,
  provider: keyof typeof AI_PROVIDERS = "gemini"
): Promise<AIReportResult> => {
  try {
    const model = AI_PROVIDERS[provider];
    if (!model) {
      console.log(`❌ ${provider} not available, skipping`);
      return {
        isViolating: false,
        reason: "AI provider not available",
        confidence: 0,
      };
    }

    const { object, usage } = await generateObject({
      model,
      schema: moderationSchema,
      system: `${AI_PROMPTS.system.base}\n${systemPrompt}`,
      prompt: userPrompt,
      maxTokens,
      temperature: 0.1,
    });

    console.log(`✅ ${provider} AI check completed:`, usage?.totalTokens || 0);

    return {
      isViolating: object.isViolating,
      reason: object.reason,
      confidence: Math.min(Math.max(object.confidence, 0), 1),
    };
  } catch (error) {
    console.log(`❌ ${provider} failed:`, error);
    return {
      isViolating: false,
      reason: "AI moderation temporarily unavailable",
      confidence: 0,
    };
  }
};

export const checkPost = async (post: Post): Promise<AIReportResult> => {
  if (!post?.content) {
    return { isViolating: false, confidence: 0 };
  }

  // Quick filter first
  if (quickCheck(post.content as string)) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  try {
    return await callAI(
      AI_PROMPTS.system.report.post,
      AI_PROMPTS.user.post(post),
      TOKEN_LIMITS.post
    );
  } catch (error) {
    console.error("Post AI check failed:", error);
    return {
      isViolating: false,
      reason: "AI moderation temporarily unavailable",
      confidence: 0,
    };
  }
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

  try {
    return await callAI(
      AI_PROMPTS.system.report.comment,
      AI_PROMPTS.user.comment(comment),
      TOKEN_LIMITS.comment
    );
  } catch (error) {
    console.error("Comment AI check failed:", error);
    return {
      isViolating: false,
      reason: "AI moderation temporarily unavailable",
      confidence: 0,
    };
  }
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

  try {
    return await callAI(
      AI_PROMPTS.system.report.user,
      AI_PROMPTS.user.user(user),
      TOKEN_LIMITS.user
    );
  } catch (error) {
    console.error("User AI check failed:", error);
    return {
      isViolating: false,
      reason: "AI moderation temporarily unavailable",
      confidence: 0,
    };
  }
};

export const checkTopicSuggestion = async (
  topic: SuggestedTopic
): Promise<AIReportResult> => {
  if (!topic?.title || !topic?.description) {
    return { isViolating: false, confidence: 0 };
  }

  if (quickCheck(topic.title) || quickCheck(topic.description)) {
    return {
      isViolating: true,
      reason: "Contains inappropriate language",
      confidence: 0.8,
    };
  }

  try {
    return await callAI(
      AI_PROMPTS.system.topic.base,
      AI_PROMPTS.user.topic(topic.title, topic.description),
      TOKEN_LIMITS.post
    );
  } catch (error) {
    console.error("Topic suggestion AI check failed:", error);
    return {
      isViolating: false,
      reason: "AI moderation temporarily unavailable",
      confidence: 0,
    };
  }
};
