export type PostTypesType = {
  title: string;
  value: string;
};

export type SoftwareOptionType = {
  title: string;
  value: string;
};

export type DifficultyLevelType = {
  title: string;
  value: string;
};

export const POST_TYPES: PostTypesType[] = [
  { title: "Text Only", value: "text" },
  { title: "Pixel Art", value: "pixelArt" },
  { title: "Animation", value: "animation" },
  { title: "Tutorial", value: "tutorial" },
  { title: "Resource", value: "resource" },
  { title: "Question", value: "question" },
];

export const SOFTWARE_OPTIONS: SoftwareOptionType[] = [
  { title: "Aseprite", value: "aseprite" },
  { title: "Piskel", value: "piskel" },
  { title: "Pixel Studio", value: "pixelStudio" },
  { title: "LibreSprite", value: "libreSprite" },
  { title: "Photoshop", value: "photoshop" },
  { title: "Other", value: "other" },
];

export const DIFFICULTY_LEVELS: DifficultyLevelType[] = [
  { title: "Beginner", value: "beginner" },
  { title: "Intermediate", value: "intermediate" },
  { title: "Advanced", value: "advanced" },
];
