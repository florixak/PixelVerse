import { SortOrder } from "@/types/filter";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | undefined,
  options?: { showTime?: boolean }
): string {
  if (!date) {
    return "Unknown date";
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(options?.showTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
  return new Date(date).toLocaleDateString("en-US", timeOptions);
}

export function getSanityOrderBy(orderBy: SortOrder): string {
  switch (orderBy) {
    case "latest":
      return "publishedAt desc";

    case "oldest":
      return "publishedAt asc";

    case "alphabetical":
      return "title asc";

    case "popular":
      return "count(reactions[type == 'like']) desc";

    case "trending":
      return "count(reactions[type == 'like']) desc, publishedAt desc";
  }
}
