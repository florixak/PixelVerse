import { Post, User } from "@/sanity.types";
import Image from "next/image";
import PostReactions from "./post-reactions";
import { Separator } from "../ui/separator";
import PostTags from "./post-tags";

type PostContentProps = {
  post: Post;
  userId?: User["_id"];
};

const PostContent = ({ post, userId }: PostContentProps) => {
  const hasImage =
    post.imageUrl && post.imageUrl.trim() !== "" && post.postType !== "text";
  const isTutorial =
    post.postType === "tutorial" &&
    post.tutorialSteps &&
    post.tutorialSteps.length > 0;

  return (
    <div className="flex flex-col gap-2 w-full">
      {hasImage && post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt={post.title || "Post Image"}
          className="object-contain max-h-[70vh] rounded-md mx-auto"
          width={800}
          height={600}
          loading="lazy"
          placeholder="blur"
          blurDataURL={post.imageUrl}
        />
      ) : null}

      {isTutorial ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Tutorial Steps</h3>
          <ol className="list-decimal list-inside">
            {post.tutorialSteps?.map((step, index) => (
              <li key={index} className="mt-2">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {step.imageUrl && (
                  <img
                    src={step.imageUrl}
                    alt={`Step ${index + 1} Image`}
                    className="object-contain max-h-[70vh] rounded-md mx-auto"
                    width={800}
                    height={600}
                    loading="lazy"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-lg text-muted-foreground mt-4">
        {(post.content as string) || "No description provided."}
      </p>

      <PostTags tags={post.tags} />

      <Separator />

      <PostReactions post={post} clerkId={userId} />
    </div>
  );
};

export default PostContent;
