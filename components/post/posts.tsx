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
        <div key={post._id} className="break-inside-avoid mb-4">
          <PostCard post={post} />
        </div>
      ))}
    </MasonryWrapper>
  );
};

export default Posts;
