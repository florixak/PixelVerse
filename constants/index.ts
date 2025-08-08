import { Reaction } from "@/sanity.types";
import type {
  DifficultyLevelType,
  PostTypesType,
  SoftwareOptionType,
} from "@/types/posts";
import { DetectedCategory } from "@/types/suggested-topics";
import { ThumbsUp, ThumbsDown, Heart, HelpCircle } from "lucide-react";

const POST_TYPES: PostTypesType[] = [
  { title: "Text Only", value: "text" },
  { title: "Pixel Art", value: "pixelArt" },
  { title: "Animation", value: "animation" },
  { title: "Tutorial", value: "tutorial" },
  { title: "Resource", value: "resource" },
  { title: "Question", value: "question" },
];

const SOFTWARE_OPTIONS: SoftwareOptionType[] = [
  { title: "Aseprite", value: "aseprite" },
  { title: "Piskel", value: "piskel" },
  { title: "Pixel Studio", value: "pixelStudio" },
  { title: "LibreSprite", value: "libreSprite" },
  { title: "Photoshop", value: "photoshop" },
  { title: "Other", value: "other" },
];

const DIFFICULTY_LEVELS: DifficultyLevelType[] = [
  { title: "Beginner", value: "beginner" },
  { title: "Intermediate", value: "intermediate" },
  { title: "Advanced", value: "advanced" },
];

const REPORT_REASONS = [
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "copyright", label: "Copyright Violation" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "other", label: "Other" },
];

type Reactions = {
  title: string;
  value: Reaction["type"];
  icon: React.ComponentType;
  color?: string;
};

const REACTIONS: Reactions[] = [
  { title: "Like", value: "like", icon: ThumbsUp, color: "text-blue-500" },
  {
    title: "Dislike",
    value: "dislike",
    icon: ThumbsDown,
    color: "text-red-500",
  },
  { title: "Love", value: "love", icon: Heart, color: "text-pink-500" },
  {
    title: "Helpful",
    value: "helpful",
    icon: HelpCircle,
    color: "text-green-500",
  },
];

const DETECTED_CATEGORIES: DetectedCategory[] = [
  { title: "Gaming", value: "gaming" },
  { title: "Art & Design", value: "art_design" },
  { title: "Retro/Nostalgia", value: "retro" },
  { title: "Technology", value: "technology" },
  { title: "Creative Tools", value: "creative_tools" },
  { title: "Community", value: "community" },
  { title: "Tutorials", value: "tutorials" },
  { title: "Inappropriate", value: "inappropriate" },
  { title: "Off-topic", value: "off_topic" },
];

export type ModerationValue =
  | "pending_ai"
  | "ai_approved"
  | "ai_rejected"
  | "needs_human_review"
  | "rejected"
  | "published";

type ModerationStatusOptions = {
  title: string;
  value: ModerationValue;
};

const MODERATION_STATUS_OPTIONS: ModerationStatusOptions[] = [
  { title: "Pending AI Review", value: "pending_ai" },
  { title: "AI Approved", value: "ai_approved" },
  { title: "AI Rejected", value: "ai_rejected" },
  { title: "Human Review Required", value: "needs_human_review" },
  { title: "Rejected", value: "rejected" },
  { title: "Published", value: "published" },
];

export {
  POST_TYPES,
  SOFTWARE_OPTIONS,
  DIFFICULTY_LEVELS,
  REPORT_REASONS,
  REACTIONS,
  DETECTED_CATEGORIES,
  MODERATION_STATUS_OPTIONS,
};
