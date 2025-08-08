import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/topics",
          "/topics/*",
          "/posts",
          "/posts/*",
          "/users/*",
          "/about",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/_next/*",
          "/studio",
          "/studio/*",
          "/suggested-topics",
          "/dashboard",
          "/settings",
          "/profile/edit",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
