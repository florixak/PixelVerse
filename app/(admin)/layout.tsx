import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "PixelDit | Admin Panel",
  description: "Post your pixel art and share it with the world!",
  keywords: [
    "pixel art",
    "art sharing",
    "community",
    "creativity",
    "digital art",
    "pixeldit",
  ],
  authors: [{ name: "Ondřej Pták", url: "https://ondrejptak.dev" }],
  openGraph: {
    title: "PixelDit",
    description: "Post your pixel art and share it with the world!",
    url: "https://pixeldit.com",
    siteName: "PixelDit",
    images: [
      {
        url: "https://pixeldit.com/og-image.png",
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
    title: "PixelDit",
    description: "Post your pixel art and share it with the world!",
    images: ["https://pixeldit.com/og-image.png"],
    creator: "@pixeldit",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
