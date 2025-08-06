import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const isGoogle = process.env.AI_OPTION === "google";

const openai = isGoogle
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })
  : createOpenAI({
      compatibility: "strict",
      apiKey: process.env.OPENAI_API_KEY,
    });

export const AI_PROVIDERS = {
  openai: openai("gpt-3.5-turbo"),
  gemini: google("gemini-1.5-flash"),
} as const;
