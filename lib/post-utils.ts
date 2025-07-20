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

/**
 * Validates and uploads an image file to Sanity
 */
export async function uploadImageAsset(imageFile: File) {
  if (!imageFile || imageFile.size === 0) {
    return null;
  }

  // Validate file size
  if (imageFile.size > IMAGE_CONFIG.maxSize) {
    throw new Error("Image file too large. Maximum size is 10MB.");
  }

  // Validate content type
  if (!IMAGE_CONFIG.allowedTypes.includes(imageFile.type as any)) {
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
        .map((tag) => tag.trim()) || [],
    imageFile: formData.get("image") as File,
  };
}
