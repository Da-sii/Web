import { searchProducts } from "@/lib/api";
import { SearchPage } from "@/components/pages/Search/SearchPage";
import type { SearchSortOption } from "@/types/models";

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
