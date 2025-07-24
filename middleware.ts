import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server";
import { ensureSanityUser } from "./lib/user-utils";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/create-post",
  "/dashboard(.*)",
  "/user/(.*)",
  "/my-reports(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
