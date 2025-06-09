"use client";

import { Topic } from "@/sanity.types";
import { getPopularTopics } from "@/sanity/lib/featured/getPopularTopics";
import { useEffect, useState } from "react";

export function useTopics(shouldFetch: boolean = true) {
  const [popularTopics, setPopularTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shouldFetch) return;

    async function fetchPopularTopics() {
      setIsLoading(true);
      try {
        const topics = await getPopularTopics();
        setPopularTopics(topics);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error fetching popular topics:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularTopics();
  }, [shouldFetch]);

  return { popularTopics, isLoading, error };
}
