import { groq } from "next-sanity";
import { client } from "../client";
import { User } from "@/sanity.types";
import { getAllPostsParams } from "./getAllPosts";
import { getSanityOrderBy } from "@/lib/utils";

type getAllUserPostsParams = getAllPostsParams & { clerkId: User["clerkId"] };

const getAllUserPosts = async ({
  clerkId,
  limit = 10,
  page = 0,
  sort = "latest",
  filter = {},
}: getAllUserPostsParams) => {
  const { software, tags, postType, difficulty, isOriginal } = filter;
  const orderBy = getSanityOrderBy(sort);
  const offset = page * limit;

  let filterConditions = `_type == "post" && isDeleted != true && isBanned != true && author->isBanned != true && author->clerkId == $clerkId`;

  if (software && software.length > 0) {
    filterConditions += ` && count((software[])[@ in $software]) > 0`;
  }
  if (tags && tags.length > 0) {
    filterConditions += ` && count((tags[])[@ in $tags]) > 0`;
  }
  if (postType) {
    filterConditions += ` && postType == $postType`;
  }
  if (difficulty) {
    filterConditions += ` && difficulty == $difficulty`;
  }
  if (isOriginal !== undefined) {
    filterConditions += ` && isOriginal == $isOriginal`;
  }

  return client.fetch(
    groq`*[${filterConditions}] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      updatedAt,
      postType,
      "imageUrl": image.asset->url,
      "author": author->{_id, username, "imageUrl": imageUrl, clerkId, role, isBanned},
      "topic": topic->{_id, title, "slug": slug.current},
      "topicSlug": topic->slug.current,
      "likes": count(reactions[type == "like"]),
      "dislikes": count(reactions[type == "dislike"]),
      tags,
      dimensions,
      software,
      isDeleted,
      content,
      disabledComments,
      "commentsCount": count(*[_type == "comment" && references(^._id) && isDeleted != true && isBanned != true]),
    } | order(${orderBy})[${offset}..${offset + limit - 1}]`,
    {
      clerkId,
      software: software || [],
      tags: tags || [],
      postType: postType || "",
      difficulty: difficulty || "",
      isOriginal: isOriginal !== undefined ? isOriginal : false,
    }
  );
};

export default getAllUserPosts;
