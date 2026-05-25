import { fetchIngredientGuides } from "@/lib/api";
import { IngredientGuidesPage } from "@/components/pages/IngredientGuides/IngredientGuidesPage";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const parsedPage = params.page ? Number(params.page) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const data = await fetchIngredientGuides({
    search: search || undefined,
    page,
  });

  return <IngredientGuidesPage initialSearch={search} page={page} data={data} />;
}
