import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const routes = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/ranking", changeFrequency: "daily", priority: 0.8 },
  { path: "/category", changeFrequency: "weekly", priority: 0.7 },
  { path: "/category/list", changeFrequency: "weekly", priority: 0.7 },
  { path: "/ingredients/guides", changeFrequency: "weekly", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
}
