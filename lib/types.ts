export type Topic = {
  title: string;
  slug: string;
  lastModified: Date;
  createdAt: Date;
  posts?: {
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
    lastModified: Date;
  }[];
};

export type SortOrder = "latest" | "oldest" | "alphabetical";
