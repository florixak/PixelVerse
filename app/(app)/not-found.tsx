import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - PixelVerse",
  description: "Sorry, we couldn't find the page you're looking for.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or deleted.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go Home
        </Link>
        <Link
          href="/topics"
          className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
        >
          Browse Topics
        </Link>
      </div>
    </div>
  );
}
