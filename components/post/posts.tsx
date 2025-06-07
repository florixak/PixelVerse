import React from "react";
import MasonryWrapper from "../masonry-wrapper";
import { Post } from "@/sanity.types";
import PostCard from "./post-card";

type PostsProps = {
  posts: Post[];
};

const Posts = ({ posts }: PostsProps) => {
  return (
    <MasonryWrapper>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          className="break-inside-avoid mb-4"
        />
      ))}
    </MasonryWrapper>
  );
};

export default Posts;
