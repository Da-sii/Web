export interface Banner {
  id: number;
  imageUrl: string;
  detailImageUrl: string;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  company: string;
  reviewCount: number;
  reviewAvg: number | null;
}

export interface RankingProduct extends Product {
  rankDiff: number | null;
}

export interface MiddleCategory {
  category: string;
  smallCategories: string[];
}

export interface Category {
  category: string;
  middleCategories: MiddleCategory[];
}

export interface RankingCategoryItem {
  bigCategory: string;
  middleCategory: string;
  smallCategory: string;
}

export interface RankingCategories {
  topSmallCategories: RankingCategoryItem[];
}

export type ProductSortOption = "monthly_rank" | "review_desc";

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
  keyPoints: string[];
  sources: string[];
  productCount: number;
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

export interface ProductImage {
  url: string;
}

export interface ProductIngredient {
  ingredientName: string;
  mainIngredient: string;
  amount: string;
  minRecommended: string;
  maxRecommended: string;
  effect: string[];
  sideEffect: string[];
  status: string;
  guideId: string | null;
}

export interface OtherIngredient {
  otherIngredientName: string;
}

export interface ProductRanking {
  bigCategory: string;
  smallCategory: string;
  monthlyRank: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  company: string;
  productType: string;
  coupang: string;
  isMyReview: boolean;
  reviewCount: number;
  reviewAvg: number | null;
  ranking: ProductRanking[];
  images: ProductImage[];
  reviewImages: ProductImage[];
  ingredientsCount: number;
  ingredients: ProductIngredient[];
  otherIngredientsCount: number;
  otherIngredients: OtherIngredient[];
}

export interface Review {
  id: number;
  name: string;
  date: string;
  isEdited: boolean;
  content: string;
  rating: number;
  images: string[];
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<string, number>;
}
