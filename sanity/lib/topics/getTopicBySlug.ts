import { Topic } from "@/sanity.types";
import { client } from "../client";

const getTopicBySlug = async (slug: string): Promise<Topic> => {
  return client.fetch(
    `*[_type == "topic" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        createdAt,
        updatedAt,
        "iconUrl": icon.asset->url,
        "bannerUrl": banner.asset->url
        }`,
    { slug }
  );
};

export default getTopicBySlug;
