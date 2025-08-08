import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using PixelVerse.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Last updated: {formatDate(new Date("2025-08-08"))}
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p>
            By accessing and using PixelVerse, you accept and agree to be bound
            by these terms. If you do not agree, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Copyright Responsibility
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>You are responsible</strong> for ensuring you have
                rights to post all content
              </li>
              <li>
                <strong>No copyrighted characters</strong> without permission
                (Nintendo, Disney, etc.)
              </li>
              <li>
                <strong>Original artwork only</strong> or content you have
                rights to use
              </li>
              <li>
                <strong>We will remove</strong> reported copyrighted content
                immediately
              </li>
              <li>
                <strong>Repeat violations</strong> will result in account
                termination
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Content Guidelines</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Acceptable Content</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Original pixel art and digital artwork</li>
                <li>Fan art clearly marked as such (personal use only)</li>
                <li>Tutorials and educational content</li>
                <li>Game screenshots you own or have permission to share</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Prohibited Content</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Copyrighted sprites extracted from games</li>
                <li>Company logos or trademarked content</li>
                <li>Content you don't have rights to distribute</li>
                <li>Commercial use of copyrighted characters</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">DMCA Copyright Policy</h2>
          <p>
            We respect intellectual property rights. If you believe content on
            PixelVerse infringes your copyright, please contact me at{" "}
            <a
              href="mailto:ptakondrej@seznam.cz"
              className="text-primary hover:underline"
            >
              ptakondrej@seznam.cz
            </a>{" "}
            with:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
            <li>Description of the copyrighted work</li>
            <li>URL of the infringing content</li>
            <li>Your contact information</li>
            <li>Statement of good faith belief</li>
            <li>Statement of accuracy under penalty of perjury</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <p className="font-semibold text-red-800 dark:text-red-200">
              By posting content, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>You own or have rights to all posted content</li>
              <li>Your content doesn't infringe third-party rights</li>
              <li>You grant us license to display your content</li>
              <li>You will defend us against any copyright claims</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Account Termination</h2>
          <p>We reserve the right to suspend or terminate your account for:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Violation of these terms</li>
            <li>Copyright infringement</li>
            <li>Repeated policy violations</li>
            <li>Illegal activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
          <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
            <p className="font-semibold mb-2">Service Provided "As Is"</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>PixelVerse is provided without warranties of any kind</li>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>You use the service at your own risk</li>
              <li>We are not liable for any damages arising from use</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🛡️ You Agree to Protect Us
            </p>
            <p>
              You agree to defend, indemnify, and hold PixelVerse harmless from
              any claims, damages, or legal fees arising from:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your posted content</li>
              <li>Your violation of these terms</li>
              <li>Copyright infringement claims</li>
              <li>Your use of the service</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service
            after changes constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
}
