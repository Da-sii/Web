import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 쿼리 조합이 무한히 늘어나는 파라미터 페이지는 색인하지 않는다.
      disallow: ["/search", "/mypage", "/category/list"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
