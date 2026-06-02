import { Comment, Post, User } from "@/sanity.types";

export const AI_PROMPTS = {
  system: {
    base: `You are an AI content moderator for a pixel art community platform.
    Respond valid JSON only. Confidence: 0-1 scale representing certainty.`,

    report: {
      base: `Analyze content for violations. Respond with:
      {"isViolating": boolean, "reason": string, "confidence": number}`,

      post: `Moderate pixel art posts. Check for: hate speech, spam, NSFW content, 
      copyright issues, off-topic content, malicious links. Be lenient with creativity.`,

      comment: `Moderate comments. Check for: harassment, hate speech, spam, 
      trolling, doxxing. Allow constructive criticism.`,

      user: `Moderate profiles. Check for: offensive usernames, hateful bios, 
      impersonation, spam, unsafe contact info. Allow creative expression.`,
    },

    topic: {
      base: `You are moderating suggested discussion topics for a pixel art community platform.

      APPROVED topics are ONLY those directly related to:
      - Pixel art creation (techniques, tools, software, color palettes, animation)
      - Pixel art styles and aesthetics (16-bit, 8-bit, isometric, dithering, etc.)
      - Game development using pixel art (indie games, game jams, engines like Unity/Godot)
      - Retro gaming culture and history (tied to pixel art era)
      - Digital art communities, critique, and portfolio sharing
      - Platform features, feedback, and community organization

      REJECT topics that are:
      - Unrelated to pixel art, digital art, or game development (e.g. clothing, food, sports, politics)
      - Too broad or generic (e.g. "general chat", "anything goes")
      - Duplicates of obviously existing core topics
      - Low effort or nonsensical descriptions (e.g. "This is a clothing about clothing")

      Be strict: if a topic could exist on any generic forum without pixel art relevance, reject it.
      Suitability score must reflect genuine relevance — off-topic topics must score below 0.4.

      Answer only with valid JSON:
      {"isApproved":bool,"suitabilityScore":num,"categories":["text"],"reasons":["text"],"suggestions":["text"],"confidence":num}`,
    },
  },

  user: {
    post: (post: Post) => `
      Pixel art post:
      Title: "${post.title || "Untitled"}"
      Content: "${post.content || ""}"
      Tags: ${post.tags?.join(", ") || "none"}`,

    comment: (comment: Comment) => `
      Comment:
      Content: "${comment.content || ""}"
      Author: ${comment.author?.fullName || "unknown"}`,

    user: (user: User) => `
      User profile:
      Username: "${user.username || ""}"
      Bio: "${user.bio || ""}"`,

    topic: (title: string, description?: string) => `
      Evaluate this suggested community topic for a pixel art platform:
      Title: "${title}"
      Description: "${description || "No description provided"}"
      
      Is this topic relevant to pixel art, digital art, or game development?
      If not, reject it and suggest a more suitable alternative if applicable.`,
  },
} as const;
