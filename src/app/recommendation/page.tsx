import type { Metadata } from "next";
import { RecommendationPage } from "@/components/pages/Recommendation/RecommendationPage";
export const metadata: Metadata = { title: "맞춤 분석", robots: { index: false, follow: true } };
export default function Page() { return <RecommendationPage />; }
