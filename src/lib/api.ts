import { toCdnUrl } from "@/lib/cdn";
import type {
  Banner,
  Category,
  IngredientGuide,
  IngredientGuideDetail,
  PaginatedResponse,
  Product,
  ProductDetail,
  ProductSortOption,
  RankingCategories,
  RankingPeriod,
  RankingProduct,
  Review,
  ReviewStats,
  SearchProduct,
  SearchSortOption,
} from "@/types/models";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function fetchBanners(): Promise<Banner[]> {
  const res = await fetch(buildUrl("/banners/"), {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch banners: ${res.status}`);
  }
  const data: Array<{
    id: number;
    image_url: string;
    detail_image_url: string;
    order: number;
  }> = await res.json();

  return data.map((b) => ({
    id: b.id,
    imageUrl: b.image_url,
    detailImageUrl: b.detail_image_url,
    order: b.order,
  }));
}

export function dedupeMainBanners(banners: Banner[]): Banner[] {
  const seen = new Set<number>();
  return banners
    .filter((b) => {
      if (seen.has(b.order)) return false;
      seen.add(b.order);
      return true;
    })
    .sort((a, b) => a.order - b.order);
}

export function getBannerDetailImages(banners: Banner[], order: number): Banner[] {
  return banners.filter((b) => b.order === order);
}

export interface FetchRankingParams {
  period?: RankingPeriod;
  category?: string;
  page?: number;
}

export async function fetchRanking(
  params: FetchRankingParams = {},
): Promise<PaginatedResponse<RankingProduct>> {
  const { period = "daily", category, page } = params;
  const res = await fetch(
    buildUrl("/products/ranking/", { period, category, page }),
    { next: { revalidate: 300 } },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch ranking: ${res.status}`);
  }
  return res.json();
}

export interface SearchProductsParams {
  word: string;
  sort?: SearchSortOption;
  page?: number;
}

export async function searchProducts(
  params: SearchProductsParams,
): Promise<PaginatedResponse<SearchProduct>> {
  const { word, sort = "monthly_rank", page } = params;
  const res = await fetch(
    buildUrl("/products/search/", { word, sort, page }),
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.status}`);
  }
  return res.json();
}

export async function fetchProductDetail(
  id: number,
): Promise<ProductDetail | null> {
  const res = await fetch(buildUrl(`/products/${id}/`), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch product detail: ${res.status}`);
  }
  return res.json();
}

export const INGREDIENT_GUIDES_PAGE_SIZE = 10;

export interface FetchIngredientGuidesParams {
  search?: string;
  page?: number;
}

export async function fetchIngredientGuides(
  params: FetchIngredientGuidesParams = {},
): Promise<PaginatedResponse<IngredientGuide>> {
  const { search, page } = params;
  const res = await fetch(
    buildUrl("/ingredients/guides/", { search, page }),
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch ingredient guides: ${res.status}`);
  }
  const data: PaginatedResponse<{ id: number; ingredient_name: string }> =
    await res.json();
  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results.map((g) => ({ id: g.id, name: g.ingredient_name })),
  };
}

export async function fetchIngredientGuideDetail(
  id: number,
): Promise<IngredientGuideDetail> {
  const res = await fetch(buildUrl(`/ingredients/guides/${id}/`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ingredient guide detail: ${res.status}`);
  }
  const data: {
    id: number;
    ingredient_id: string;
    name: string;
    mainIngredients: string;
    keyPoints: string | string[];
    sources: string | string[];
    productCount: string | number;
  } = await res.json();
  const keyPoints = Array.isArray(data.keyPoints)
    ? data.keyPoints
    : typeof data.keyPoints === "string"
      ? data.keyPoints.split(/\r?\n/)
      : [];
  const sources = Array.isArray(data.sources)
    ? data.sources
    : typeof data.sources === "string"
      ? data.sources.split(/\r?\n/)
      : [];
  return {
    id: data.id,
    ingredientId: data.ingredient_id,
    name: data.name,
    mainIngredients: data.mainIngredients,
    keyPoints: keyPoints
      .map((p) => p.replace(/^\s*[-•·*]\s*/, "").trim())
      .filter((p) => p.length > 0),
    sources: sources.map((s) => s.trim()).filter((s) => s.length > 0),
    productCount: Number(data.productCount) || 0,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(buildUrl("/products/category/"), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }
  return res.json();
}

export interface FetchProductsParams {
  bigCategory?: string;
  middleCategory?: string;
  smallCategory?: string;
  sort?: ProductSortOption;
  page?: number;
}

export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<PaginatedResponse<Product>> {
  const { bigCategory, middleCategory, smallCategory, sort = "monthly_rank", page } = params;
  const res = await fetch(
    buildUrl("/products/list/", { bigCategory, middleCategory, smallCategory, sort, page }),
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}

export async function fetchRankingCategories(): Promise<RankingCategories> {
  const res = await fetch(buildUrl("/products/ranking/category/"), {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ranking categories: ${res.status}`);
  }
  return res.json();
}

export type AdvertisementInquiryType = "domestic" | "global" | "other";
export type AdvertisementLaunchStatus =
  | "launched"
  | "within_1_month"
  | "within_3_months"
  | "over_3_months";

export interface AdvertisementInquiryPayload {
  inquiry_type: AdvertisementInquiryType;
  brand_name: string;
  launch_status: AdvertisementLaunchStatus;
  inquiry_content: string;
  name: string;
  contact_number: string;
  email: string;
}

export async function fetchReviewStats(productId: number): Promise<ReviewStats> {
  const res = await fetch(buildUrl(`/review/product/${productId}/rating/`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch review stats: ${res.status}`);
  const data = await res.json();
  const dist = (data.rating_distribution ?? {}) as Record<string, number>;
  const total = data.total_reviews || 0;
  const distribution: Record<string, number> = {};
  for (const key of ["1", "2", "3", "4", "5"]) {
    distribution[key] = total > 0 ? Math.round(((dist[key] ?? 0) / total) * 100) : 0;
  }
  return {
    totalReviews: total,
    averageRating: data.average_rating ?? 0,
    distribution,
  };
}

export async function fetchReviews(productId: number, cursor = 0): Promise<Review[]> {
  const res = await fetch(buildUrl(`/review/product/${productId}/reviews/${cursor}/`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  const raw = await res.json();
  const items: Record<string, unknown>[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.reviews)
      ? Object.values(raw.reviews as Record<string, unknown>)
      : (raw?.results ?? []);
  return items.map((r) => ({
    id: (r.review_id ?? r.id) as number,
    name: (r.user_nickname ?? r.name ?? "익명") as string,
    date: (r.date ?? "") as string,
    isEdited: (r.updated ?? false) as boolean,
    content: (r.review ?? r.content ?? "") as string,
    rating: (r.rate ?? r.rating ?? 0) as number,
    images: ((r.images ?? []) as unknown[])
      .map((img) => toCdnUrl(typeof img === "string" ? img : (img as { url?: string })?.url ?? ""))
      .filter(Boolean),
  }));
}

export async function submitAdvertisementInquiry(
  payload: AdvertisementInquiryPayload,
): Promise<void> {
  const res = await fetch(buildUrl("/auth/advertisement/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit advertisement inquiry: ${res.status}`);
  }
}
