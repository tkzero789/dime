import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
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
