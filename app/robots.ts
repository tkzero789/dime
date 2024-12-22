import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/sign-in",
        "/sign-up",
        "/privacy-policy",
        "/terms-of-service",
      ],
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
    sitemap: "https://dimebudget.com/sitemap.xml",
  };
}
