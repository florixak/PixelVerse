import type {
  DifficultyLevelType,
  PostTypesType,
  SoftwareOptionType,
} from "@/types/posts";

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

export { POST_TYPES, SOFTWARE_OPTIONS, DIFFICULTY_LEVELS, REPORT_REASONS };
