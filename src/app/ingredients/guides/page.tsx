import type { Metadata } from "next";
import { fetchIngredientGuides } from "@/lib/api";
import { IngredientGuidesPage } from "@/components/pages/IngredientGuides/IngredientGuidesPage";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "성분 가이드",
  description:
    "다이어트 보조제 성분별 효능과 적정 섭취량, 부작용을 한눈에 확인하세요.",
  alternates: { canonical: absoluteUrl("/ingredients/guides") },
  openGraph: {
    type: "website",
    title: "성분 가이드 - Dasii",
    description:
      "다이어트 보조제 성분별 효능과 적정 섭취량, 부작용을 한눈에 확인하세요.",
    url: absoluteUrl("/ingredients/guides"),
    siteName: "다시",
    locale: "ko_KR",
  },
};

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
