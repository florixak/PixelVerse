import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "./getUserByClerkId";
import { canAccessDashboard } from "@/lib/user-utils";
import { client } from "../client";
import { groq } from "next-sanity";
import { User } from "@/sanity.types";

type GetAllUsersParams = {
  limit?: number;
};

const getAllUsers = async ({
  limit = 15,
}: GetAllUsersParams): Promise<User[]> => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  const sanityUser = await getUserByClerkId(user.id);
  if (!sanityUser || !sanityUser.clerkId)
    throw new Error("Sanity user not found or clerkId is missing");
  if (sanityUser.isBanned) throw new Error("User is banned");
  if (!canAccessDashboard(sanityUser.clerkId))
    throw new Error("User is not an admin");

  return client.fetch(
    groq`*[_type == "user"] | order(createdAt desc) [0...$limit] {
      _id,
      createdAt,
      username,
      fullName,
      email,
      clerkId,
      imageUrl,
      isBanned,
      role,
      bio,
      "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true]),
      "commentCount": count(*[_type == "comment" && references(^._id) && isDeleted != true]),
      "followerCount": count(*[_type == "follow" && following._ref == ^._id]),
      "followingCount": count(*[_type == "follow" && follower._ref == ^._id]),
      isReported
    }`,
    { limit }
  );
};

export default getAllUsers;
