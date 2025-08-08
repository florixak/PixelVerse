import { client } from "../client";
import { SuggestedTopic } from "@/sanity.types";

export async function getSuggestedTopicById(
  id: SuggestedTopic["_id"]
): Promise<SuggestedTopic | null> {
  return client.fetch(
    `
    *[_type == "suggestedTopic" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      "iconUrl": icon.asset->url,
      "bannerUrl": banner.asset->url,
      icon,
      banner,
      status,
      aiModerationResult,
      "submittedBy": submittedBy-> {
        _id,
        username,
        imageUrl
      },
      submittedAt,
      _createdAt,
      _updatedAt
    }
  `,
    { id }
  );
}
