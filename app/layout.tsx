import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelDit",
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
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider defaultTheme="system" attribute="class">
            <Header />
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />

              <main>
                <SidebarTrigger className="size-10 cursor-pointer" />
                {children}
              </main>
            </SidebarProvider>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
