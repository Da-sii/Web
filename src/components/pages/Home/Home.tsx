import { Suspense } from "react";
import { dedupeMainBanners, fetchBanners, fetchRanking } from "@/lib/api";
import { BannerSlider } from "./components/BannerSlider";
import { BannerSliderSkeleton } from "./components/BannerSliderSkeleton";
import { RankingSection } from "./components/RankingSection";
import { RankingSectionSkeleton } from "./components/RankingSectionSkeleton";
import { GuideTagSection } from "./components/GuideTagSection";
import { Bottom } from "./components/Bottom";

async function BannerSection() {
  const banners = await fetchBanners();
  return <BannerSlider banners={dedupeMainBanners(banners)} />;
}

async function MonthlyRanking() {
  const { results } = await fetchRanking({ period: "monthly" });
  return <RankingSection products={results} />;
}

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <Suspense fallback={<BannerSliderSkeleton />}>
        <BannerSection />
      </Suspense>
      <Suspense fallback={<RankingSectionSkeleton />}>
        <MonthlyRanking />
      </Suspense>
      <GuideTagSection />
      <Bottom/>
    </div>
  );
}
