"use server";

import { writeClient } from "@/sanity/lib/client";
import slugify from "slugify";

export const suggestTopic = async (
  formData: FormData
): Promise<{ success: boolean; error?: string }> => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const iconFile = formData.get("icon") as File;
  let iconAsset = null;

  const ICON_MAX_SIZE_BYTES = 1024 * 1024;

  if (iconFile && iconFile.size > ICON_MAX_SIZE_BYTES) {
    return { success: false, error: "Icon must be smaller than 1MB" };
  }

  if (iconFile && iconFile.size > 0) {
    const imageBuffer = Buffer.from(await iconFile.arrayBuffer());

    iconAsset = await writeClient.assets.upload("image", imageBuffer, {
      filename: iconFile.name,
      contentType: iconFile.type,
    });
  }

  const bannerFile = formData.get("banner") as File;
  let bannerAsset = null;

  const BANNER_MAX_SIZE_BYTES = 2 * ICON_MAX_SIZE_BYTES; // 2MB

  if (bannerFile && bannerFile.size > BANNER_MAX_SIZE_BYTES) {
    return { success: false, error: "Banner must be smaller than 2MB" };
  }

  if (bannerFile && bannerFile.size > 0) {
    const bannerBuffer = Buffer.from(await bannerFile.arrayBuffer());
    bannerAsset = await writeClient.assets.upload("image", bannerBuffer, {
      filename: bannerFile.name,
      contentType: bannerFile.type,
    });
  }

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  let baseSlug = slugify(title, { lower: true, strict: true });

  const existingSlugs = await writeClient.fetch(
    `*[_type == "post" && slug.current == $slug].slug.current`,
    { slug: baseSlug }
  );

  let finalSlug = baseSlug;
  if (existingSlugs.length > 0) {
    finalSlug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  const topic = {
    _type: "topic",
    slug: {
      _type: "slug",
      current: finalSlug,
    },
    title,
    description,
    icon: iconAsset
      ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: iconAsset._id,
          },
        }
      : null,
    banner: bannerAsset
      ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: bannerAsset._id,
          },
        }
      : null,
    createdAt: new Date().toISOString(),
  };

  const suggestedTopic = await writeClient.create(topic);
  if (!suggestedTopic) {
    throw new Error("Failed to create topic");
  }

  return {
    success: true,
  };
};
