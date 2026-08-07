import type { Metadata } from "next";
import { fetchRanking, fetchRankingCategory } from "@/lib/api";
import { RankingPage } from "@/components/pages/Ranking/RankingPage";
import type { RankingPeriod } from "@/types/models";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "랭킹" };

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
