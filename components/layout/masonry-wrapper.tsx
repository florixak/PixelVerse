import { cn } from "@/lib/utils";

type MasonryWrapperProps = {
  children?: React.ReactNode;
  className?: string;
};

const MasonryWrapper = ({ children, className }: MasonryWrapperProps) => {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MasonryWrapper;
