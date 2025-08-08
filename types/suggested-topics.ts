export type AITopicModerationResult = {
  _type: "aiModerationResult";
  isApproved: boolean;
  suitabilityScore: number;
  categories: DetectedCategory["value"][];
  reasons: string[];
  suggestions: string[];
  checkedAt: string;
  confidence?: number;
};

export type DetectedCategory = {
  title: string;
  value:
    | "gaming"
    | "art_design"
    | "retro"
    | "technology"
    | "creative_tools"
    | "community"
    | "tutorials"
    | "inappropriate"
    | "off_topic";
};

export type Status =
  | "pending_ai"
  | "ai_approved"
  | "ai_rejected"
  | "needs_human_review"
  | "manually_approved"
  | "published"
  | "rejected";
