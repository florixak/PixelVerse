import { formatDate } from "@/lib/utils";
import { Post } from "@/sanity.types";
import PostAuthorButtons from "./post-author-buttons";
import PostAuthor from "./post-author";

type PostHeaderProps = {
  post: Post;
  isAuthor?: boolean;
};

const PostHeader = ({ post, isAuthor }: PostHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between mb-2">
        <PostAuthor author={post.author} publishedAt={post.publishedAt} />
        {isAuthor && <PostAuthorButtons postId={post._id} />}
      </div>

      <h1 className="text-3xl font-bold">{post.title}</h1>
    </div>
  );
};

export default PostHeader;
