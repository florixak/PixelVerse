import { Post } from "@/sanity.types";
import PostAuthorButtons from "./post-author-buttons";
import PostAuthor from "./post-author";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import getAllTopics from "@/sanity/lib/topics/getAllTopics";

type PostHeaderProps = {
  post: Post;
  isAuthor?: boolean;
};

const PostHeader = async ({ post, isAuthor }: PostHeaderProps) => {
  const [topic, topics] = await Promise.all([
    getTopicBySlug(post.topicSlug || ""),
    getAllTopics({}),
  ]);

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between mb-2">
        <PostAuthor author={post.author} publishedAt={post.publishedAt} />
        {isAuthor && (
          <PostAuthorButtons post={post} topic={topic} topics={topics} />
        )}
      </div>

      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        {post.dimensions && (
          <p>
            Dimensions: {post.dimensions.width + "x" + post.dimensions.height}
          </p>
        )}
        {post.software && (
          <p>Created with: {post.software.map((sw) => sw).join(", ")}</p>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
