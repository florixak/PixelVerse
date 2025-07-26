import { Topic } from "@/sanity.types";
import { client } from "../client";

const getTopicBySlug = async (slug: string): Promise<Topic> => {
  return client.fetch(
    `*[_type == "topic" && slug.current == $slug && isDeleted != true][0] {
        _id,
        title,
        "slug": slug.current,
        description,
        createdAt,
        updatedAt,
        isDeleted,
        "iconUrl": icon.asset->url,
        "bannerUrl": banner.asset->url,
        "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true && isBanned != true]),
        }`,
    { slug }
  );
};

export default getTopicBySlug;
