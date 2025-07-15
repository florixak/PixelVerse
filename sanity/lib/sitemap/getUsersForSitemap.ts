import { client } from "../client";
import { groq } from "next-sanity";
import { User } from "@/sanity.types";

const getUsersForSitemap = async (): Promise<
  Pick<User, "createdAt" | "username">[]
> => {
  return client.fetch(
    groq`*[_type == "user" && "isBanned != true"] {
      createdAt,
      username,
    } | order(count(*[_type == "post" && author._ref == ^._id]) desc) [0...200]`
  );
};

export default getUsersForSitemap;
