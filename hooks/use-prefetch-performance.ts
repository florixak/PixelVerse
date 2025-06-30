"use client";

import { useEffect } from "react";

type UsePrefetchPerformanceProps = {
  queryKey: string[];
  wasDataPrefetched: boolean;
};

export const usePrefetchPerformance = ({
  queryKey,
  wasDataPrefetched,
}: UsePrefetchPerformanceProps) => {
  useEffect(() => {
    const key = queryKey.join("-");

    if (wasDataPrefetched) {
      console.log(`🚀 Query "${key}" was served from prefetched cache`);

      if (typeof window !== "undefined" && "performance" in window) {
        const loadTime = performance.now();
        console.log(`⚡ Time to hydration: ${loadTime.toFixed(2)}ms`);
      }
    } else {
      console.log(
        `🐌 Query "${key}" had to fetch from network (not prefetched)`
      );
    }
  }, [queryKey, wasDataPrefetched]);
};
