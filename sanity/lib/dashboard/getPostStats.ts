import { groq } from "next-sanity";
import { client } from "../client";

export async function getPostStats() {
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
