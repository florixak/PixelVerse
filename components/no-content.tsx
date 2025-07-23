type NoContentProps = {
  message?: string;
  contentType?: "post" | "topic";
};

const NoContent = ({ message, contentType }: NoContentProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="text-gray-500 text-lg">
        {message || `No ${contentType || "content"} available`}
      </div>
      <div className="mt-2 text-sm text-gray-400">
        {contentType === "post"
          ? "Create a new post to get started."
          : "Suggest a new topic or check back later."}
      </div>
    </div>
  );
};

export default NoContent;
