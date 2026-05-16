import { BannerSlider } from "./components/BannerSlider";
import { RankingSection } from "./components/RankingSection";
import { GuideTagSection } from "./components/GuideTagSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <BannerSlider />
      <RankingSection />
      <GuideTagSection />
    </div>
  );
}
