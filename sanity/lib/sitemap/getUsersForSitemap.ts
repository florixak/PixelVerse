import { client } from "../client";
import { groq } from "next-sanity";
import { User } from "@/sanity.types";

export type getUsersForSitemapReturn = Pick<User, "createdAt" | "username">[];

const getUsersForSitemap = async (): Promise<getUsersForSitemapReturn> => {
  return client.fetch(
    groq`*[_type == "user" && isBanned != true] {
      createdAt,
      username,
    } | order(count(*[_type == "post" && author._ref == ^._id]) desc) [0...200]`
  );
};

export default getUsersForSitemap;
