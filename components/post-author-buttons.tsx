"use client";

import { deletePost } from "@/actions/postActions";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type PostAuthorButtonsProps = {
  postId: string;
};

const PostAuthorButtons = ({ postId }: PostAuthorButtonsProps) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  const handleEdit = async () => {};

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    toast.loading("Deleting post...", {
      id: "delete-post",
    });
    try {
      await deletePost(postId);
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
    <div className="absolute z-10 mb-4 text-sm text-muted-foreground right-5 top-5 bg-muted p-2 rounded shadow">
      <Button
        variant="ghost"
        className="text-sm"
        onClick={handleEdit}
        disabled={editing || deleting}
      >
        Edit
      </Button>
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
