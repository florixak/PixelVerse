import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "PixelVerse",
  description: "Post your pixel art and share it with the world!",
  keywords: [
    "pixel art",
    "art sharing",
    "community",
    "creativity",
    "digital art",
    "pixelverse",
  ],
  authors: [{ name: "Ondřej Pták", url: "https://ondrejptak.dev" }],
  openGraph: {
    title: "PixelVerse",
    description: "Post your pixel art and share it with the world!",
    url: "https://pixelverse.com",
    siteName: "PixelVerse",
    images: [
      {
        url: "https://pixelverse.com/og-image.png",
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
    title: "PixelVerse",
    description: "Post your pixel art and share it with the world!",
    images: ["https://pixelverse.com/og-image.png"],
    creator: "@pixelverse",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "system";

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
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
