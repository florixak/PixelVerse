import { Post, SuggestedTopic } from "@/sanity.types";
import { writeClient } from "@/sanity/lib/client";
import slugify from "slugify";

/**
 * Image upload configuration and validation
 */
export const IMAGE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB is a common, reasonable maximum for web uploads
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
} as const;

type ImageType = (typeof IMAGE_CONFIG.allowedTypes)[number];

/**
 * Validates and uploads an image file to Sanity
 */
export async function uploadImageAsset(
  imageFile: File,
  maxSize: number = IMAGE_CONFIG.maxSize
) {
  if (!imageFile || imageFile.size === 0) {
    return null;
  }

  // Validate file size
  if (imageFile.size > maxSize) {
    throw new Error(
      `Image file too large. Maximum size is ${maxSize / 1024 / 1024}MB.`
    );
  }

  // Validate content type
  if (!IMAGE_CONFIG.allowedTypes.includes(imageFile.type as ImageType)) {
    throw new Error(`Unsupported image type: ${imageFile.type}`);
  }

  try {
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Ensure filename has proper extension
    const filename =
      imageFile.name || `image-${Date.now()}.${imageFile.type.split("/")[1]}`;

    const imageAsset = await writeClient.assets.upload("image", imageBuffer, {
      filename,
      contentType: imageFile.type,
    });

    return {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: imageAsset._id,
      },
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
}

/**
 * Normalizes image dimensions from a string input.
 * Accepts formats like "32x32", "128x64", etc.
 */
export function normalizeDimensions(input: string): string | undefined {
  if (!input) return undefined;
  const cleaned = input.replace(/\s+/g, "").toLowerCase();
  if (/^\d{1,4}x\d{1,4}$/.test(cleaned)) {
    return cleaned;
  }
  return undefined;
}

/**
 * Generates a unique slug for a post title
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true });

  const existingSlugs = await writeClient.fetch(
    `*[_type == "post" && slug.current == $slug].slug.current`,
    { slug: baseSlug }
  );

  if (existingSlugs.length === 0) {
    return baseSlug;
  }

  // Add timestamp suffix to make it unique
  return `${baseSlug}-${Date.now().toString().slice(-6)}`;
}

/**
 * Validates that a topic exists
 */
export async function validateTopicExists(topicId: string): Promise<boolean> {
  const topicExists = await writeClient.fetch(
    `*[_type == "topic" && _id == $topicId][0]._id`,
    { topicId }
  );

  return !!topicExists;
}

/**
 * Gets topic slug by ID
 */
export async function getTopicSlug(topicId: string): Promise<string> {
  const topic = await writeClient.fetch(
    `*[_type == "topic" && _id == $topicId][0]{ "slug": slug.current }`,
    { topicId }
  );

  return topic?.slug || "unknown";
}

/**
 * Parses form data into structured post data
 */
export function parsePostFormData(formData: FormData) {
  const width = formData.get("width")?.toString() || "";
  const height = formData.get("height")?.toString() || "";

  return {
    title: formData.get("title")?.toString() || "Untitled Post",
    content: formData.get("content")?.toString() || "",
    topicId: formData.get("topic")?.toString() || "",
    postType: formData.get("postType")?.toString() || "pixelArt",
    disabledComments: formData.get("disabledComments") === "true",
    dimensions: `${width}x${height}`,
    software: formData.get("software")?.toString(),
    tags:
      formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((tag) => slugify(tag)) || [],
    imageFile: formData.get("image") as File,
    isOriginal: formData.get("isOriginal") === "true",
    colorPalette: formData.get("colorPalette")
      ? JSON.parse(formData.get("colorPalette") as string)
      : [],
    tutorialSteps: formData.get("tutorialSteps")
      ? JSON.parse(formData.get("tutorialSteps") as string)
      : [],
    inspirationSource: formData.get("inspirationSource")?.toString() || "",
  };
}

/**
 * Parses form data into structured topic suggestion data
 */
export function parseTopicSuggestionFormData(formData: FormData) {
  return {
    title: formData.get("title")?.toString() || "Untitled Topic",
    description: formData.get("description")?.toString() || "",
    icon: formData.get("icon") as File,
    banner: formData.get("banner") as File,
  };
}

/**
 * Gets the status variant for a suggested topic
 */
export const getStatusVariant = (status: SuggestedTopic["status"]) => {
  switch (status) {
    case "ai_approved":
      return "default";
    case "ai_rejected":
      return "destructive";
    case "needs_human_review":
      return "secondary";
    case "manually_approved":
      return "default";
    case "published":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
};

/**
 * Gets the emoji representation of a suggested topic status
 */
export const getStatusEmoji = (status: SuggestedTopic["status"]) => {
  switch (status) {
    case "pending_ai":
      return "⏳";
    case "ai_approved":
      return "✅";
    case "ai_rejected":
      return "❌";
    case "needs_human_review":
      return "👁️";
    case "manually_approved":
      return "✅";
    case "rejected":
      return "🚫";
    case "published":
      return "🚀";
    default:
      return "❓";
  }
};
