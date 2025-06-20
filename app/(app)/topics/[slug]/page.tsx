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
        <div className="flex items-center justify-center sm:items-start sm:justify-start flex-col w-full">
          <div className="flex flex-col md:flex-row items-center gap-2">
            {topic.iconUrl ? (
              <Image
                src={topic.iconUrl}
                alt={`Icon for ${topic.title}`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
                priority
              />
            ) : null}
            <h1 className="text-4xl font-bold">{topic.title}</h1>
          </div>

          <p className="text-muted-foreground">
            {topic.description || "No description available for this topic."}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Posts:</span> {topic.postCount || 0}
          </p>
          <div className="max-w-xs w-full flex items-center justify-center sm:justify-start gap-2 mt-4">
            <Button variant="outline" asChild>
              <Link
                href={`/create-post?topic=${encodeURIComponent(topic.slug)}`}
                className="flex items-center gap-2"
              >
                <span>Create New Post</span>
                <Plus />
              </Link>
            </Button>
            <SortFilterSelect />
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

  return <Posts posts={posts} />;
};

export default TopicPage;
