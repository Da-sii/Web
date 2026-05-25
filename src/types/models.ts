export interface Banner {
  id: number;
  imageUrl: string;
  detailImageUrl: string;
  order: number;
}

export interface RankingProduct {
  id: number;
  name: string;
  image: string;
  company: string;
  reviewCount: number;
  reviewAvg: number | null;
  rankDiff: number | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type RankingPeriod = "daily" | "monthly";

export interface IngredientGuide {
  id: number;
  name: string;
}

export interface IngredientGuideDetail {
  id: number;
  ingredientId: string;
  name: string;
  mainIngredients: string;
  keyPoints: string;
  sources: string;
  productCount: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  linkUrl: string;
}

export interface SearchProduct {
  id: number;
  name: string;
  image: string;
  company: string;
  reviewCount: number;
  reviewAvg: number | null;
}

export type SearchSortOption = "monthly_rank" | "review_desc";
