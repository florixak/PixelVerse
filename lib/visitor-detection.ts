"use server";

import { cookies } from "next/headers";

export const isReturningVisitor = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return cookieStore.has("pixelverse_returning_visitor");
};

export const markAsReturningVisitor = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "pixelverse_returning_visitor",
    value: "true",
  });
};
