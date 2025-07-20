import { Comment, Post, Report, User } from "@/sanity.types";

export const checkReportByAI = (report: Report) => {
  if (!report || !report.reportedContent) {
    return false;
  }

  const content = report.reportedContent;

  if (content._type === "post") {
    return checkPostByAI(content);
  } else if (content._type === "comment") {
    return checkCommentByAI(content);
  } else if (content._type === "user") {
    return checkUserByAI(content);
  }

  return false;
};

const checkPostByAI = (post: Post) => {
  if (!post || !post.content) {
    return false;
  }

  const content = post.content as string;
  const title = post.title || "";
  const tags = post.tags || [];

  return false;
};

const checkCommentByAI = (comment: Comment) => {
  if (!comment || !comment.content) {
    return false;
  }

  const content = comment.content;
  const author = comment.author || "";

  return false;
};

const checkUserByAI = (user: User) => {
  if (!user || !user.username) {
    return false;
  }

  const username = user.username;
  const bio = user.bio || "";
  const fullName = user.fullName || "";
  const email = user.email || "";

  return false;
};
