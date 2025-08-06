import z from "zod";

export const moderationSchema = z.object({
  isViolating: z.boolean(),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
});

export const topicSuggestionSchema = z.object({
  isApproved: z.boolean(),
  suitabilityScore: z.number().min(0).max(1),
  categories: z.array(z.string()),
  reasons: z.array(z.string()),
  suggestions: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  checkedAt: z.string().optional(),
});
