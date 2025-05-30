import React from "react";

const PostPage = async ({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) => {
  const { slug, postSlug } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post: {postSlug}</h1>
      <p className="text-gray-700">
        This is the content of the post with slug: {postSlug} in topic: {slug}.
      </p>
      {/* Here you can add more details about the post, like content, author, etc. */}
    </div>
  );
};

export default PostPage;
