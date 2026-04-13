import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/projects", "/review", "/brand", "/expert",
          "/feedback", "/billing", "/crm", "/analytics", "/autonomy",
          "/performance", "/ai-engine", "/proactive", "/publishing",
          "/benchmarks", "/sla", "/api", "/login"],
      },
    ],
  }
}
