import type {
  Banner,
  PaginatedResponse,
  RankingPeriod,
  RankingProduct,
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
