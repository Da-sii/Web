export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

export interface Product {
  id: number;
  name: string;
  companyName: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  rank: number;
}

export interface IngredientGuide {
  id: number;
  name: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  linkUrl: string;
}
