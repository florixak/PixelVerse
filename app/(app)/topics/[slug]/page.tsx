import Posts from "@/components/post/posts";
import SortFilterSelect from "@/components/sort-filter-select";
import { Button } from "@/components/ui/button";
import { SortOrder } from "@/lib/types";
import getPostsByTopic from "@/sanity/lib/posts/getPostsByTopic";
import getTopicBySlug from "@/sanity/lib/topics/getTopicBySlug";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: SortOrder }>;
};

const TopicPage = async ({ params, searchParams }: TopicPageProps) => {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const { sort } = await searchParams;

  const topic = await getTopicBySlug(decodeURIComponent(slug));
  if (!topic || !topic.slug) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-3 px-0 py-6 md:p-6 w-full">
      <div className="flex flex-col items-start gap-4">
        {topic.bannerUrl && (
          <Image
            src={topic.bannerUrl}
            alt={`Banner for ${topic.title}`}
            width={1200}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
            priority
          />
        )}
        <div className="w-full">
          <h1 className="text-4xl font-bold">{topic.title}</h1>
          <p className="text-muted-foreground">
            {topic.description || "No description available for this topic."}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Posts:</span> {topic.postCount || 0}
          </p>
          <div className="flex flex-row justify-between items-center w-full mt-4">
            <Button variant="outline" asChild>
              <Link
                href={`/create-post?topic=${encodeURIComponent(topic.slug)}`}
                className="flex items-center gap-2"
              >
                <span>Create New Post</span>
                <Plus />
              </Link>
            </Button>
            <div className="w-64">
              <SortFilterSelect />
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsList slug={slug} sort={sort} />
      </Suspense>
    </section>
  );
};

const PostsList = async ({
  slug,
  sort,
}: {
  slug: string;
  sort?: SortOrder;
}) => {
  const posts = await getPostsByTopic(slug, sort);

  console.log(sort);

  return <Posts posts={posts} />;
};

export default TopicPage;
