import type { Metadata } from "next";
import { searchProducts } from "@/lib/api";
import { SearchPage } from "@/components/pages/Search/SearchPage";
import { absoluteUrl } from "@/lib/site";
import type { SearchSortOption } from "@/types/models";

export const metadata: Metadata = {
  title: "검색",
  description: "다이어트 보조제를 성분과 후기로 검색해보세요.",
  alternates: { canonical: absoluteUrl("/search") },
  // 검색어 조합이 무한하므로 색인하지 않되 링크는 따라가게 둔다.
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{
    word?: string;
    sort?: string;
    page?: string;
  }>;
}

function normalizeSort(sort: string | undefined): SearchSortOption {
  return sort === "review_desc" ? "review_desc" : "monthly_rank";
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const word = params.word?.trim() ?? "";

  if (!word) {
    return <SearchPage />;
  }

  const pageNumber = params.page ? Number(params.page) : undefined;
  const { results } = await searchProducts({
    word,
    sort: normalizeSort(params.sort),
    page: Number.isFinite(pageNumber) ? pageNumber : undefined,
  });

  return <SearchPage initialWord={word} results={results} />;
}
