const FLAGGED_WORDS = [
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

export const quickCheck = (content: string): boolean => {
  const lowerContent = content.toLowerCase();
  return FLAGGED_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lowerContent);
  });
};

export const getViolationLevel = (
  content: string
): "none" | "mild" | "severe" => {
  const severeWords = ["nazi", "nigger", "kill", "die"];
  const mildWords = ["idiot", "stupid", "dumb"];

  const lowerContent = content.toLowerCase();

  if (severeWords.some((word) => lowerContent.includes(word))) return "severe";
  if (mildWords.some((word) => lowerContent.includes(word))) return "mild";
  return "none";
};
