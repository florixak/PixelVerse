type PostCommentsWrapperProps = {
  children: React.ReactNode;
};

const PostCommentsWrapper = ({ children }: PostCommentsWrapperProps) => {
  return <div className="flex flex-col w-full gap-2">{children}</div>;
};

export default PostCommentsWrapper;
