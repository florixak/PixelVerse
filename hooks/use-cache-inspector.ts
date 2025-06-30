"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCacheInspector = (enabled = false) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== "development") return;

    const logCache = () => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();

      console.group("🔍 React Query Cache Inspector");
      console.log(`Total queries in cache: ${queries.length}`);

      queries.forEach((query) => {
        const { queryKey, state } = query;
        const status = state.status;
        const dataUpdateCount = state.dataUpdateCount;

        console.log(`
📄 Query: ${JSON.stringify(queryKey)}
   Status: ${status}
   Data Updates: ${dataUpdateCount}
   Has Data: ${!!state.data}
        `);
      });
      console.groupEnd();
    };

    logCache();

    const interval = setInterval(logCache, 5000);

    return () => clearInterval(interval);
  }, [queryClient, enabled]);
};
