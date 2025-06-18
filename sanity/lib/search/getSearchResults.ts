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
  results: Array<
    | (Post & { _resultType: "post" })
    | (Topic & { _resultType: "topic" })
    | (User & { _resultType: "user" })
  >;
  totalResults: number;
  counts: {
    posts: number;
    topics: number;
    users: number;
  };
  validationMessage?: string;
};

export async function getSearchResults({
  query = "",
  limit = 20,
  page = 1,
  filter = "all",
}: SearchParams): Promise<SearchResultsResponse> {
  // Minimum search length validation
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 3) {
    return {
      results: [],
      totalResults: 0,
      counts: { posts: 0, topics: 0, users: 0 },
      validationMessage: "Please enter at least 3 characters to search",
    };
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  // Break query into words for better matching (only words with 3+ chars)
  const queryWords = trimmedQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length >= 3)
    .map((word) => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")); // Escape special chars

  // If no valid words after filtering, use the original query
  const searchTerms =
    queryWords.length > 0
      ? queryWords
      : [trimmedQuery.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")];

  // Build a GROQ condition that matches any of the words
  const buildSearchCondition = (field: string) => {
    const conditions = searchTerms.map(
      (term) => `lower(${field}) match "*${term}*"`
    );
    return `(${conditions.join(" || ")})`;
  };

  try {
    const result = await client.fetch(
      groq`{
        "posts": ${
          filter === "all" || filter === "posts"
            ? `*[
          _type == "post" && 
          defined(slug.current) && 
          publishedAt < now() && 
          !isDeleted &&
          (
        ${searchTerms
          .map(
            (term) => `
          lower(coalesce(title, "")) match "*${term}*" || 
          lower(coalesce(excerpt, "")) match "*${term}*" ||
          defined(content) && pt::text(content) match "*${term}*"
        `
          )
          .join(" || ")}
      )
    ] {
          _type,
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          excerpt,
          "imageUrl": mainImage.asset->url,
          "likes": coalesce(likes, 0),
          "commentCount": count(*[_type == "comment" && references(^._id)]),
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
        } | order(publishedAt desc)`
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
          "postCount": count(*[_type == "post" && references(^._id)]),
          "memberCount": count(*[_type == "user" && references(^._id)])
        } | order(postCount desc)`
            : "[]"
        },
        
        "users": ${
          filter === "all" || filter === "users"
            ? `*[
          _type == "user" && 
          (
            ${buildSearchCondition("username")} || 
            ${buildSearchCondition("bio")}
          )
        ] {
          _type,
          _id,
          username,
          "slug": username,
          bio,
          "imageUrl": image.asset->url,
          "postCount": count(*[_type == "post" && author._ref == ^._id]),
          "followerCount": count(*[_type == "follow" && following._ref == ^._id])
        } | order(followerCount desc)`
            : "[]"
        },
        
        "totalPosts": ${
          filter === "all" || filter === "posts"
            ? `count(*[
          _type == "post" && 
          defined(slug.current) && 
          publishedAt < now() && 
          !isDeleted &&
          (
            ${buildSearchCondition("title")} || 
            ${buildSearchCondition("excerpt")} || 
            defined(content) && ${buildSearchCondition("pt::text(content)")}
          )
        ])`
            : "0"
        },
        
        "totalTopics": ${
          filter === "all" || filter === "topics"
            ? `count(*[
          _type == "topic" && 
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
          _type == "user" && 
          (
            ${buildSearchCondition("username")} || 
            ${buildSearchCondition("bio")}
          )
        ])`
            : "0"
        }
      }`
    );

    // Calculate total results
    const totalResults =
      result.totalPosts + result.totalTopics + result.totalUsers;

    // For combined results, we need to merge, sort, and then paginate
    let allResults: any[] = [];

    if (filter === "all") {
      // Combine all results, adding a _resultType field
      allResults = [
        ...result.posts.map((item: Post) => ({
          ...item,
          _resultType: "post" as const,
        })),
        ...result.topics.map((item: Topic) => ({
          ...item,
          _resultType: "topic" as const,
        })),
        ...result.users.map((item: User) => ({
          ...item,
          _resultType: "user" as const,
        })),
      ];

      // Sort combined results by relevance (simplified example)
      // You can implement a more sophisticated ranking algorithm
      allResults.sort((a, b) => {
        // Title exact match gets highest priority
        const getTitleOrUsername = (item: any) => {
          if (item._resultType === "user") return item.username;
          return item.title;
        };

        const aTitle = getTitleOrUsername(a);
        const bTitle = getTitleOrUsername(b);

        const aExactMatch = aTitle?.toLowerCase() === query.toLowerCase();
        const bExactMatch = bTitle?.toLowerCase() === query.toLowerCase();

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Then prioritize by type (posts, topics, users)
        const typeOrder: Record<"post" | "topic" | "user", number> = {
          post: 0,
          topic: 1,
          user: 2,
        };
        return (
          typeOrder[a._resultType as "post" | "topic" | "user"] -
          typeOrder[b._resultType as "post" | "topic" | "user"]
        );
      });
    } else if (filter === "posts") {
      allResults = result.posts
        .slice(start, end)
        .map((item: Post) => ({ ...item, _resultType: "post" as const }));
    } else if (filter === "topics") {
      allResults = result.topics
        .slice(start, end)
        .map((item: Topic) => ({ ...item, _resultType: "topic" as const }));
    } else if (filter === "users") {
      allResults = result.users
        .slice(start, end)
        .map((item: User) => ({ ...item, _resultType: "user" as const }));
    }

    return {
      results: allResults,
      totalResults,
      counts: {
        posts: result.totalPosts,
        topics: result.totalTopics,
        users: result.totalUsers,
      },
    };
  } catch (error) {
    console.error("Search query failed:", error);
    return {
      results: [],
      totalResults: 0,
      counts: { posts: 0, topics: 0, users: 0 },
      validationMessage: "An error occurred while searching",
    };
  }
}
