"use client";

import { deletePost } from "@/actions/postActions";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CreatePostForm from "./post-form/create-post-form";
import { Post, Topic } from "@/sanity.types";
import { Input } from "../ui/input";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Sheet,
} from "../ui/sheet";
import { Label } from "../ui/label";

type PostAuthorButtonsProps = {
  post: Post | null;
  topic: Topic | null;
  topics: Topic[];
};

const PostAuthorButtons = ({ post, topic, topics }: PostAuthorButtonsProps) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  if (!post) return null;

  const handleEdit = async () => {};

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    toast.loading("Deleting post...", {
      id: "delete-post",
    });
    try {
      await deletePost(post._id);
      toast.success("Post deleted successfully!");
      const currentPath = window.location.pathname;
      const topic = currentPath.split("/")[2];
      if (topic) {
        router.push(`/topics/${topic}`);
      } else {
        router.push("/topics");
      }
    } catch (error) {
      toast.error("Failed to delete the post. Please try again.");
    } finally {
      setDeleting(false);
      toast.dismiss("delete-post");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetTrigger asChild>
          <Button variant="outline">Edit</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto px-6 md:px-12 py-4">
          <SheetHeader>
            <SheetTitle>Edit Post</SheetTitle>
            <SheetDescription>
              Make changes to your post. All changes will be saved
              automatically.
            </SheetDescription>
          </SheetHeader>
          <CreatePostForm
            topics={topics}
            topic={topic}
            post={post}
            className="p-0 max-w-none"
            onSuccess={() => setEditing(false)}
          />
        </SheetContent>
      </Sheet>
      <Button
        variant="destructive"
        className="ml-2 text-sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default PostAuthorButtons;
