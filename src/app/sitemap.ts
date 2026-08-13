import type { MetadataRoute } from "next";
import {
  INGREDIENT_GUIDES_PAGE_SIZE,
  fetchBanners,
  fetchCategories,
  fetchIngredientGuides,
  fetchProducts,
  fetchRanking,
} from "@/lib/api";
import { absoluteUrl } from "@/lib/site";
import { TERMS } from "@/lib/terms";

export const revalidate = 3600;

/** 색인 대상 정적 라우트. /products 는 /category/list 로 리다이렉트되므로 제외. */
const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/ranking", changeFrequency: "daily", priority: 0.8 },
  { path: "/category", changeFrequency: "weekly", priority: 0.7 },
  { path: "/ingredients/guides", changeFrequency: "weekly", priority: 0.8 },
  { path: "/inquiry", changeFrequency: "yearly", priority: 0.3 },
] as const;

/** 사이트맵 하나 때문에 빌드가 깨지면 안 된다. 실패한 소스는 조용히 건너뛴다. */
async function safely<T>(work: Promise<T>, fallback: T): Promise<T> {
  try {
    return await work;
  } catch {
    return fallback;
  }
}

const MAX_PRODUCTS_PER_CATEGORY = 100;
const MAX_GUIDE_PAGES = 20;

async function collectProductIds(): Promise<number[]> {
  const ids = new Set<number>();

  // 랭킹 상위 제품
  const ranking = await safely(fetchRanking({ period: "monthly" }), {
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  for (const product of ranking.results) ids.add(product.id);

  // 대분류별 제품 목록
  const categories = await safely(fetchCategories(), []);
  for (const category of categories) {
    let page = 1;
    let collected = 0;
    for (;;) {
      const res = await safely(
        fetchProducts({ bigCategory: category.category, page }),
        { count: 0, next: null, previous: null, results: [] },
      );
      for (const product of res.results) ids.add(product.id);
      collected += res.results.length;
      if (!res.next || collected >= MAX_PRODUCTS_PER_CATEGORY) break;
      page += 1;
    }
  }

  return [...ids];
}

async function collectGuideIds(): Promise<number[]> {
  const ids: number[] = [];
  for (let page = 1; page <= MAX_GUIDE_PAGES; page += 1) {
    const res = await safely(fetchIngredientGuides({ page }), {
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
    for (const guide of res.results) ids.push(guide.id);
    if (!res.next || res.results.length < INGREDIENT_GUIDES_PAGE_SIZE) break;
  }
  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const [productIds, guideIds, banners] = await Promise.all([
    collectProductIds(),
    collectGuideIds(),
    safely(fetchBanners(), []),
  ]);

  const bannerOrders = [...new Set(banners.map((b) => b.order))];

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    })),
    ...productIds.map((id) => ({
      url: absoluteUrl(`/products/${id}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...guideIds.map((id) => ({
      url: absoluteUrl(`/ingredients/guides/${id}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...bannerOrders.map((order) => ({
      url: absoluteUrl(`/banners/${order}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...TERMS.map((term) => ({
      url: absoluteUrl(`/terms/${term.id}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
