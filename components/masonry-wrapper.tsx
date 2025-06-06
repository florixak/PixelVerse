type MasonryWrapperProps = {
  children?: React.ReactNode;
};

const MasonryWrapper = ({ children }: MasonryWrapperProps) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
      {children}
    </div>
  );
};

export default MasonryWrapper;
