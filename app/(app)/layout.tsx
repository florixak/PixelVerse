import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";
import CommandSearch from "@/components/command-search";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelVerse",
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
    title: "PixelVerse",
    description: "Post your pixel art and share it with the world!",
    url: "https://pixelverse.com",
    siteName: "PixelVerse",
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
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
            <Header />
            <Toaster position="bottom-right" />
            <CommandSearch />
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />

              <main className="relative min-h-screen w-full px-4 mt-6">
                <SidebarTrigger
                  className="fixed top-3 z-40 size-10 rounded-md bg-background border shadow-sm hover:bg-muted transition-colors duration-200"
                  aria-label="Toggle sidebar"
                />
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
