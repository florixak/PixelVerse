import z from "zod";

export const moderationSchema = z.object({
  isViolating: z.boolean(),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
});
