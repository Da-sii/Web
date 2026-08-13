import type { Metadata } from "next";
import { fetchCategories } from "@/lib/api";
import { CategoryPage } from "@/components/pages/Category/CategoryPage";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "카테고리",
  description:
    "체지방 감소, 탄수화물 컷, 유산균 등 목적별 다이어트 보조제를 카테고리로 찾아보세요.",
  alternates: { canonical: absoluteUrl("/category") },
  openGraph: {
    type: "website",
    title: "카테고리 - Dasii",
    description:
      "체지방 감소, 탄수화물 컷, 유산균 등 목적별 다이어트 보조제를 카테고리로 찾아보세요.",
    url: absoluteUrl("/category"),
    siteName: "다시",
    locale: "ko_KR",
  },
};

export default async function Page() {
  const categories = await fetchCategories();
  return <CategoryPage categories={categories} />;
}
