import { groq } from "next-sanity";
import { client } from "../client";

type PostStats = {
  total: number;
  new24h: number;
};

export async function getPostStats(): Promise<PostStats> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISOString = yesterday.toISOString();

  return client.fetch(
    groq`{
      "total": count(*[_type == "post"]),
      "new24h": count(*[_type == "post" && publishedAt > $yesterday])
    }`,
    { yesterday: yesterdayISOString }
  );
}
