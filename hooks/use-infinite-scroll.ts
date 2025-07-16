import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type GetLatestPostsParams<T> = {
  limit: number;
  queryFn: (params: { page: number; limit: number }) => Promise<T>;
  queryKey: string[];
};

const useInfiniteScroll = <T>({
  queryFn,
  limit = 8,
  queryKey,
}: GetLatestPostsParams<T>) => {
  const {
    data,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = 0 }) =>
      await queryFn({ page: pageParam, limit: limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage)) return undefined;
      if (!lastPage || lastPage.length < limit) return undefined;
      return allPages.length;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const dataPages = data?.pages.flat() || [];

  return {
    data: dataPages,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ref, // Ref to attach to the sentinel element
    inView, // Whether the sentinel is in view
    limit, // The limit used for pagination
  };
};

export default useInfiniteScroll;
