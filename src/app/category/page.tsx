import type { Metadata } from "next";
import { fetchCategories } from "@/lib/api";
import { CategoryPage } from "@/components/pages/Category/CategoryPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "카테고리" };

export default async function Page() {
  const categories = await fetchCategories();
  return <CategoryPage categories={categories} />;
}
