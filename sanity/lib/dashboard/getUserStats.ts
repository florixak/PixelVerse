import { groq } from "next-sanity";
import { client } from "../client";

export async function getUserStats(): Promise<{
  total: number;
  new24h: number;
  active24h: number;
}> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISOString = yesterday.toISOString();

  return client.fetch(
    groq`{
      "total": count(*[_type == "user"]),
      "new24h": count(*[_type == "user" && _createdAt > $yesterday]),
      "active24h": count(*[_type == "user" && _updatedAt > $yesterday])
    }`,
    { yesterday: yesterdayISOString }
  );
}
