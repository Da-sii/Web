import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { CategoryListPage } from "@/components/pages/Category/CategoryListPage";
import { absoluteUrl } from "@/lib/site";
import type { ProductSortOption } from "@/types/models";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "카테고리 상품",
  description: "카테고리별 다이어트 보조제 목록을 성분과 리뷰로 비교해보세요.",
  alternates: { canonical: absoluteUrl("/category/list") },
  // 대/중/소분류 × 정렬 조합이 무한히 늘어나므로 색인 대상에서 제외한다.
  robots: { index: false, follow: true },
};

const ALL = "전체";

function normalizeSort(sort: string | undefined): ProductSortOption {
  return sort === "review_desc" ? "review_desc" : "monthly_rank";
}

/** 필터 없음을 뜻하는 "전체" 는 API 파라미터로 보내지 않는다. */
function normalizeFilter(value: string | undefined): string {
  return !value || value === ALL ? "" : value;
}

interface PageProps {
  searchParams: Promise<{
    main?: string;
    middle?: string;
    sub?: string;
    sort?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const categories = await fetchCategories();

  // 파라미터 없이 들어와도 빈 화면이 되지 않도록 첫 대분류로 기본 설정
  const bigCategory = params.main ?? categories[0]?.category ?? "";
  if (params.main && !categories.some((c) => c.category === params.main)) {
    notFound();
  }

  const middleCategory = normalizeFilter(params.middle);
  const smallCategory = normalizeFilter(params.sub);
  const sort = normalizeSort(params.sort);

  const { count, results, next } = await fetchProducts({
    bigCategory,
    middleCategory,
    smallCategory,
    sort,
  });

  return (
    <CategoryListPage
      initialProducts={results}
      initialCount={count}
      initialHasNext={next !== null}
      categories={categories}
      initialBigCategory={bigCategory}
      initialMiddleCategory={middleCategory}
      initialSmallCategory={smallCategory}
      initialSort={sort}
    />
  );
}
