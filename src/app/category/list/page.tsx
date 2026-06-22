import { notFound } from "next/navigation";
import { fetchCategories } from "@/lib/api";
import { CategoryListClient } from "@/components/pages/Category/CategoryListClient";

export const metadata = {
  title: "카테고리 상품",
};

type SearchParams = Promise<{
  main?: string;
  middle?: string;
  sub?: string;
}>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { main, middle, sub } = await searchParams;
  if (!main) notFound();

  const categories = await fetchCategories();
  if (!categories.find((c) => c.category === main)) {
    notFound();
  }

  return (
    <CategoryListClient
      categories={categories}
      initialMain={main}
      initialMiddle={middle ?? "전체"}
      initialSub={sub ?? "전체"}
    />
  );
}
