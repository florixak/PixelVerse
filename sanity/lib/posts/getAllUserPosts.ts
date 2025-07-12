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
  return client.fetch(
    groq`*[_type == "post" && isDeleted != true && author->isBanned != true && author->clerkId == $clerkId] | order(publishedAt desc) {
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
      "commentsCount": count(*[_type == "comment" && references(^._id)]),
    } | order(${orderBy})[${offset}..${offset + limit - 1}] ${
      software ? `&& software[any(_ in $software)]` : ""
    } ${tags ? `&& tags[any(_ in $tags)]` : ""} ${
      postType ? `&& postType == $postType` : ""
    } ${difficulty ? `&& difficulty == $difficulty` : ""} ${
      isOriginal !== undefined ? `&& isOriginal == $isOriginal` : ""
    }`,
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
