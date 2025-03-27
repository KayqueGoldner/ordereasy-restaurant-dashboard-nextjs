import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL for the site
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://ordereasy-dashboard.vercel.app";

  // Current date for lastModified
  const currentDate = new Date();

  // Define static routes
  const routes = [
    // Public routes
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/activity`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },

    // Admin routes
    {
      url: `${baseUrl}/admin/inventory`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admin/inventory/create`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/admin/report`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },

    // Auth routes
    {
      url: `${baseUrl}/sign-in`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return routes;
}
