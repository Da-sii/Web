import type { IngredientGuide, CategoryItem } from "@/types/models";

export const ingredientGuides: IngredientGuide[] = [
  { id: 1, name: "가르시니아캄보지아(HCA)" },
  { id: 2, name: "판토텐산" },
  { id: 3, name: "프락토올리고당" },
  { id: 4, name: "인동덩굴꽃봉오리추출물" },
  { id: 5, name: "녹차추출물" },
  { id: 6, name: "바나바잎추출물" },
  { id: 7, name: "셀렌" },
];

export const categoryItems: CategoryItem[] = [
  { id: 1, name: "체지방 감소", linkUrl: "/products?category=fat-loss" },
  { id: 2, name: "탄수화물 컷", linkUrl: "/products?category=carb-cut" },
  { id: 3, name: "포만감 증가", linkUrl: "/products?category=satiety" },
  { id: 4, name: "에너지 부스터", linkUrl: "/products?category=energy" },
  { id: 5, name: "유산균/장건강", linkUrl: "/products?category=probiotics" },
  { id: 6, name: "단백질", linkUrl: "/products?category=protein" },
];
