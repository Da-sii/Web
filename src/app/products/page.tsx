import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { ProductsPage } from "@/components/pages/Products/ProductsPage";
import type { ProductSortOption } from "@/types/models";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "제품 목록" };

function normalizeSort(sort: string | undefined): ProductSortOption {
  return sort === "review_desc" ? "review_desc" : "monthly_rank";
}

interface PageProps {
  searchParams: Promise<{
    main?: string;
    middle?: string;
    small?: string;
    sort?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const bigCategory = params.main ?? "";
  const middleCategory = params.middle ?? "";
  const smallCategory = params.small ?? "";
  const sort = normalizeSort(params.sort);

  const [categories, { count, results, next }] = await Promise.all([
    fetchCategories(),
    fetchProducts({ bigCategory, middleCategory, smallCategory, sort }),
  ]);

  return (
    <ProductsPage
      initialProducts={results}
      initialCount={count}
      categories={categories}
      initialBigCategory={bigCategory}
      initialMiddleCategory={middleCategory}
      initialSmallCategory={smallCategory}
      initialSort={sort}
    />
  );
}
