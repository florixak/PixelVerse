import { groq } from "next-sanity";
import { client } from "../client";
import { Post } from "@/sanity.types";
import { getSanityOrderBy } from "@/lib/utils";
import { SortOrder } from "@/types/filter";

export type getAllPostsParams = {
  limit?: number;
  page?: number;
  sort?: SortOrder;
  filter?: {
    software?: string[];
    tags?: string[];
    postType?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    isOriginal?: boolean;
  };
};

const getAllPosts = async ({
  limit = 10,
  page = 0,
  sort = "latest",
  filter = {},
}: getAllPostsParams): Promise<Post[]> => {
  const { software, tags, postType, difficulty, isOriginal } = filter;
  const orderBy = getSanityOrderBy(sort);
  const offset = page * limit;

  return client.fetch<Post[]>(
    groq`*[_type == "post" && isDeleted != true && isBanned != true && author->isBanned != true] {
      _id,
      title,
      "slug": slug.current,
      "topicSlug": topic->slug.current,
      excerpt,
      publishedAt,
      updatedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      "topic": topic->{_id, title, "slug": slug.current},
      "likes": count(reactions[type == "like"]),
      "dislikes": count(reactions[type == "dislike"]),
      tags,
      dimensions,
      software,
      isDeleted,
      content,
      disabledComments,
      "commentsCount": count(*[_type == "comment" && references(^._id) && isBanned != true]),
    } | order(${orderBy})[${offset}..${offset + limit - 1}] ${
      software ? `&& software[any(_ in $software)]` : ""
    } ${tags ? `&& tags[any(_ in $tags)]` : ""} ${
      postType ? `&& postType == $postType` : ""
    } ${difficulty ? `&& difficulty == $difficulty` : ""} ${
      isOriginal !== undefined ? `&& isOriginal == $isOriginal` : ""
    }`,
    {
      software: software || [],
      tags: tags || [],
      postType: postType || "",
      difficulty: difficulty || "",
      isOriginal: isOriginal !== undefined ? isOriginal : false,
    }
  );
};

export default getAllPosts;
