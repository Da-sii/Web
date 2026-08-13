import type { Metadata } from "next";
import { fetchRanking, fetchRankingCategory } from "@/lib/api";
import { RankingPage } from "@/components/pages/Ranking/RankingPage";
import { absoluteUrl } from "@/lib/site";
import type { RankingPeriod } from "@/types/models";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "랭킹",
  description: "리뷰와 판매량 기준 다이어트 보조제 인기 순위를 확인하세요.",
  alternates: { canonical: absoluteUrl("/ranking") },
  openGraph: {
    type: "website",
    title: "랭킹 - Dasii",
    description: "리뷰와 판매량 기준 다이어트 보조제 인기 순위를 확인하세요.",
    url: absoluteUrl("/ranking"),
    siteName: "다시",
    locale: "ko_KR",
  },
};

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const period: RankingPeriod = params.period === "monthly" ? "monthly" : "daily";

  const [{ results }, { topSmallCategories }] = await Promise.all([
    fetchRanking({ period }),
    fetchRankingCategory(),
  ]);

  return (
    <RankingPage
      initialProducts={results}
      initialPeriod={period}
      categories={topSmallCategories}
    />
  );
}
