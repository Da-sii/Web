import { toCdnUrl } from "@/lib/cdn";
import type {
  Banner,
  GetProductsPayload,
  ICategory,
  IRankingCategory,
  IngredientGuide,
  IngredientGuideDetail,
  PaginatedResponse,
  Product,
  ProductDetail,
  ProductImage,
  ProductListResponse,
  RankingPeriod,
  RankingProduct,
  Review,
  ReviewStats,
  SearchProduct,
  SearchSortOption,
} from "@/types/models";

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const url = new URL(path, apiBaseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

interface BannerDTO {
  id: number;
  image_url: string;
  /** 구 스키마: 배너 한 장당 상세 이미지 1장, 같은 order를 가진 row가 여러 개 */
  detail_image_url?: string | null;
  /** 신 스키마: row 하나가 상세 이미지 전부를 배열로 들고 있음 */
  detail_images?: Array<{
    id: number;
    detail_image_url: string;
    order: number;
  }> | null;
  order: number;
}

function toDetailImages(b: BannerDTO): string[] {
  const fromArray = (b.detail_images ?? [])
    .slice()
    .sort((x, y) => x.order - y.order)
    .map((d) => d.detail_image_url)
    .filter(Boolean);
  if (fromArray.length > 0) return fromArray;
  return b.detail_image_url ? [b.detail_image_url] : [];
}

export async function fetchBanners(): Promise<Banner[]> {
  const res = await fetch(buildUrl("/banners/"), {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch banners: ${res.status}`);
  }
  const data: BannerDTO[] = await res.json();

  return data.map((b) => ({
    id: b.id,
    imageUrl: b.image_url,
    detailImages: toDetailImages(b),
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

/**
 * 배너 상세 이미지 목록.
 * 신 스키마에서는 해당 order의 배너 하나가 이미 전부를 들고 있고,
 * 구 스키마에서는 같은 order의 row들이 한 장씩 나눠 갖고 있으므로 둘 다 처리한다.
 */
export function getBannerDetailImages(
  banners: Banner[],
  order: number,
): string[] {
  const matched = banners.filter((b) => b.order === order);
  const first = matched[0]?.detailImages ?? [];
  if (first.length > 1 || matched.length <= 1) return first;
  return matched.flatMap((b) => b.detailImages);
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

export async function fetchCategories(): Promise<ICategory[]> {
  const res = await fetch(buildUrl("/products/category/"), {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }
  return res.json();
}

export async function fetchRankingCategory(): Promise<IRankingCategory> {
  const res = await fetch(buildUrl("/products/ranking/category/"), {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ranking category: ${res.status}`);
  }
  return res.json();
}

export async function fetchProducts(
  payload: GetProductsPayload,
): Promise<ProductListResponse> {
  const params: Record<string, string | number | undefined> = {};
  if (payload.bigCategory) params.bigCategory = payload.bigCategory;
  if (payload.middleCategory && payload.middleCategory !== "전체") {
    params.middleCategory = payload.middleCategory;
  }
  if (payload.smallCategory && payload.smallCategory !== "전체") {
    params.smallCategory = payload.smallCategory;
  }
  if (payload.sort) params.sort = payload.sort;
  if (payload.page) params.page = payload.page;

  const res = await fetch(buildUrl("/products/list/", params), {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch category products: ${res.status}`);
  }
  return res.json();
}

export const fetchCategoryProducts = fetchProducts;

/** 서버는 이미지 필드에 S3 키를 주기도 하고 절대 URL을 주기도 한다. 둘 다 CDN URL로 정규화한다. */
function toImageList(raw: unknown): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((img) =>
      toCdnUrl(typeof img === "string" ? img : (img as { url?: string })?.url),
    )
    .filter(Boolean)
    .map((url) => ({ url }));
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
  const data = await res.json();
  return {
    ...data,
    images: toImageList(data?.images),
    reviewImages: toImageList(data?.reviewImages),
    ranking: data?.ranking ?? [],
    ingredients: data?.ingredients ?? [],
    otherIngredients: data?.otherIngredients ?? [],
  } as ProductDetail;
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
