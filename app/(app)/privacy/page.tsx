import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PixelVerse protects and handles your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Last updated: {formatDate(new Date("2025-08-08"))}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Email address (via Clerk authentication)</li>
                <li>Username and display name</li>
                <li>Profile picture (optional)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Content You Create</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Posts and comments</li>
                <li>Images and pixel art</li>
                <li>Topic suggestions</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Data Storage and Security
          </h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🔒 Secure Storage
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Sanity.io</strong> - Content and image storage
              </li>
              <li>
                <strong>Clerk</strong> - Authentication and user data
              </li>
              <li>
                <strong>Vercel</strong> - Application hosting
              </li>
              <li>
                <strong>Industry-standard encryption</strong> in transit and at
                rest
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Rights (GDPR)</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <strong>Access</strong> - Request your personal data
            </li>
            <li>
              <strong>Correction</strong> - Fix inaccurate information
            </li>
            <li>
              <strong>Deletion</strong> - Delete your account and data
            </li>
            <li>
              <strong>Portability</strong> - Export your content
            </li>
            <li>
              <strong>Objection</strong> - Object to data processing
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p>
            For privacy questions, contact:{" "}
            <a
              href="mailto:ptakondrej@seznam.cz"
              className="text-primary hover:underline"
            >
              ptakondrej@seznam.cz
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
