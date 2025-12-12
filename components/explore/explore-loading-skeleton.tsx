import { Skeleton } from "../ui/skeleton";

const ExploreLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
      ))}
    </div>
  );
};

export default ExploreLoadingSkeleton;
