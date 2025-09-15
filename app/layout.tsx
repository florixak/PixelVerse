import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";
import { VT323 } from "next/font/google";

const pixelFont = VT323({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: {
    default: "PixelVerse - Share Your Pixel Art",
    template: "%s - PixelVerse",
  },
  description:
    "Discover the world of pixel art, share your creations, and connect with fellow artists in our growing community. Join PixelVerse today!",
  keywords: [
    "pixel art",
    "art sharing",
    "community",
    "creativity",
    "digital art",
    "pixelverse",
    "art community",
    "art platform",
    "creative expression",
    "artistic community",
    "pixel artists",
    "art enthusiasts",
    "art discovery",
    "art collaboration",
    "art showcase",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  authors: [{ name: "Ondřej Pták", url: "https://github.com/florixak" }],
  creator: "Ondřej Pták",
  openGraph: {
    title: {
      default: "PixelVerse - Share Your Pixel Art",
      template: "%s - PixelVerse",
    },
    description:
      "Discover the world of pixel art, share your creations, and connect with fellow artists in our growing community. Join PixelVerse today!",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "PixelVerse",
    images: [
      {
        url: "/pixelverse-logo.png",
        width: 1200,
        height: 630,
        alt: "PixelDit OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "PixelVerse - Share Your Pixel Art",
      template: "%s - PixelVerse",
    },
    description:
      "Discover the world of pixel art, share your creations, and connect with fellow artists in our growing community. Join PixelVerse today!",
    images: ["/pixelverse-logo.png"],
    creator: "@pixelverse",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning className={pixelFont.variable}>
        <body className={`antialiased`}>
          <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
