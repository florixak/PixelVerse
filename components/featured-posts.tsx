import { Post } from "@/sanity.types";
import React from "react";

type FeaturedPostsProps = {
  posts?: Post[];
  className?: string;
  showTitle?: boolean;
  title?: string;
};

const FeaturedPosts = ({ posts = [], className = "" }: FeaturedPostsProps) => {
  return (
    <div className={`featured-posts ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              Created on: {new Date(post._createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Last modified: {new Date(post._updatedAt).toLocaleDateString()}
            </p>
            <a
              href={`/topics/${post.topic?.slug}/${post.slug}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Post
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;
