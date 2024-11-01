import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sign-in", "/sign-up", "/sitemap.xml"],
      disallow: [
        "/budgets(.*)",
        "/dashboard(.*)",
        "/income(.*)",
        "/penny(.*)",
        "/recurring(.*)",
        "/saving(.*)",
        "/spending(.*)",
        "/transaction(.*)",
      ],
    },
    sitemap: "https://dime-mu.vercel.app/sitemap.xml",
  };
}
