import { Post, Topic, User } from "@/sanity.types";
import { client } from "../client";
import { groq } from "next-sanity";

type SearchParams = {
  query: string;
  limit?: number;
  page?: number;
  filter?: "all" | "posts" | "topics" | "users";
};

type SearchResultsResponse = {
  posts: (Post & { _resultType: "post" })[];
  topics: (Topic & { _resultType: "topic" })[];
  users: (User & { _resultType: "user" })[];
  totalPosts: number;
  totalTopics: number;
  totalUsers: number;
  validationMessage?: string;
};

export async function getSearchResults({
  query = "",
  limit = 20,
  page = 1,
  filter = "all",
}: SearchParams): Promise<SearchResultsResponse> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 3) {
    return {
      posts: [],
      topics: [],
      users: [],
      totalPosts: 0,
      totalTopics: 0,
      totalUsers: 0,
      validationMessage: "Please enter at least 3 characters to search",
    };
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  const queryWords = trimmedQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length >= 3)
    .map((word) => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));

  const searchTerms =
    queryWords.length > 0
      ? queryWords
      : [trimmedQuery.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")];

  const buildSearchCondition = (field: string) => {
    const conditions = searchTerms.map(
      (term) => `lower(${field}) match "*${term}*"`
    );
    return `(${conditions.join(" || ")})`;
  };

  try {
    const postsFilter = `
  _type == "post" && 
  defined(slug.current) && defined(slug.current) && isDeleted != true && isBanned != true && author->isBanned != true &&
  (
    ${searchTerms
      .map(
        (term) => `
          lower(coalesce(title, "")) match "*${term}*" ||
          lower(coalesce(slug.current, "")) match "*${term}*" ||
          lower(coalesce(excerpt, "")) match "*${term}*" ||
          (defined(content) && lower(pt::text(content)) match "*${term}*")
        `
      )
      .join(" || ")}
  )
`;

    const result = await client.fetch(
      groq`{
        "posts": ${
          filter === "all" || filter === "posts"
            ? `*[${postsFilter}] {
          _type,
          _id,
          title,
          "slug": slug.current,
          "topicSlug": topic->slug.current,
          publishedAt,
          excerpt,
          "imageUrl": image.asset->url,
          "likes": coalesce(likes, 0),
          "commentCount": count(*[_type == "comment" && references(^._id) && isBanned != true && isDeleted != true]),
          "author": author->{
            _id,
            username,
            "imageUrl": image.asset->url
          },
          "topic": topic->{
            _id,
            title,
            "slug": slug.current
          }
        } | order(publishedAt desc) [${start}...${end}]`
            : "[]"
        },
        
        "topics": ${
          filter === "all" || filter === "topics"
            ? `*[
          _type == "topic" && 
          defined(slug.current) &&
          (
            ${buildSearchCondition("title")} || 
            ${buildSearchCondition("description")}
          )
        ] {
          _type,
          _id,
          title,
          description,
          "slug": slug.current,
          "imageUrl": image.asset->url,
          color,
          "postCount": count(*[_type == "post" && references(^._id) && isDeleted != true && isBanned != true && author->isBanned != true]),
          "memberCount": count(*[_type == "user" && references(^._id) && isBanned != true])
        } | order(postCount desc) [${start}...${end}]`
            : "[]"
        },
        
        "users": ${
          filter === "all" || filter === "users"
            ? `*[
          _type == "user" && isBanned != true &&
          (
            ${buildSearchCondition("username")} || 
            ${buildSearchCondition("bio")}
          )
        ] {
      _id,
      _createdAt,
      username,
      fullName,
      email,
      clerkId,
      imageUrl,
      role,
      bio,
          "postCount": count(*[_type == "post" && author._ref == ^._id]),
          "followerCount": count(*[_type == "follow" && following._ref == ^._id])
        } | order(followerCount desc) [${start}...${end}]`
            : "[]"
        },
        
        "totalPosts": ${
          filter === "all" || filter === "posts"
            ? `count(*[
      _type == "post" && 
      defined(slug.current) && 
      isDeleted != true && isBanned != true && author->isBanned != true &&
      (
        ${searchTerms
          .map(
            (term) => `
              lower(coalesce(title, "")) match "*${term}*" ||
              lower(coalesce(slug.current, "")) match "*${term}*" ||
              lower(coalesce(excerpt, "")) match "*${term}*" ||
              (defined(content) && lower(pt::text(content)) match "*${term}*")
            `
          )
          .join(" || ")}
      )
    ])`
            : "0"
        },
        
        "totalTopics": ${
          filter === "all" || filter === "topics"
            ? `count(*[
          _type == "topic" && isBanned != true &&
          defined(slug.current) &&
          (
            ${buildSearchCondition("title")} || 
            ${buildSearchCondition("description")}
          )
        ])`
            : "0"
        },
        
        "totalUsers": ${
          filter === "all" || filter === "users"
            ? `count(*[
          _type == "user" && isBanned != true && (
            ${buildSearchCondition("username")} || 
            ${buildSearchCondition("bio")}
          )
        ])`
            : "0"
        }
      }`
    );

    return {
      posts: (result.posts || []).map((item: Post) => ({
        ...item,
        _resultType: "post" as const,
      })),
      topics: (result.topics || []).map((item: Topic) => ({
        ...item,
        _resultType: "topic" as const,
      })),
      users: (result.users || []).map((item: User) => ({
        ...item,
        _resultType: "user" as const,
      })),
      totalPosts: result.totalPosts || 0,
      totalTopics: result.totalTopics || 0,
      totalUsers: result.totalUsers || 0,
    };
  } catch (error) {
    console.error("Search query failed:", error);
    return {
      posts: [],
      topics: [],
      users: [],
      totalPosts: 0,
      totalTopics: 0,
      totalUsers: 0,
      validationMessage: "An error occurred while searching",
    };
  }
}
