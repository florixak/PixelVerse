import { client } from "../client";
import { SuggestedTopic } from "@/sanity.types";

export async function getAllSuggestedTopics(): Promise<SuggestedTopic[]> {
  return client.fetch(`
    *[_type == "suggestedTopic"] | order(submittedAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "iconUrl": icon.asset->url,
      "bannerUrl": banner.asset->url,
      status,
      aiModerationResult,
      "submittedBy": submittedBy-> {
        _id,
        username
      },
      submittedAt,
      _createdAt,
      _updatedAt
    }
  `);
}
