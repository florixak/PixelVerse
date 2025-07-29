import { Reaction } from "@/sanity.types";
import { client } from "../client";

export type GetReactions = Pick<
  Reaction,
  "_id" | "type" | "user" | "_createdAt"
>;

export type GetReactionCounts = {
  like: number;
  dislike: number;
  love: number;
  helpful: number;
};

export type GetUserReaction = Pick<Reaction, "_id" | "type"> | null;

export const getReactions = async (
  contentId: string
): Promise<GetReactions[]> => {
  return await client.fetch(
    `
    *[_type == "reaction" && content._ref == $contentId] {
      _id,
      type,
      user->{
        _id,
        username,
      },
      _createdAt
    }
  `,
    { contentId }
  );
};

export const getReactionCounts = async (
  contentId: string
): Promise<GetReactionCounts> => {
  return await client.fetch(
    `
    {
      "like": count(*[_type == "reaction" && content._ref == $contentId && type == "like"]),
      "dislike": count(*[_type == "reaction" && content._ref == $contentId && type == "dislike"]),
      "love": count(*[_type == "reaction" && content._ref == $contentId && type == "love"]),
      "helpful": count(*[_type == "reaction" && content._ref == $contentId && type == "helpful"])
    }
  `,
    { contentId }
  );
};

export const getUserReaction = async (
  contentId: string,
  clerkId: string
): Promise<GetUserReaction> => {
  return await client.fetch(
    `
    *[_type == "reaction" && content._ref == $contentId && user->clerkId == $clerkId][0] {
      _id,
      type
    }
  `,
    { contentId, clerkId }
  );
};
