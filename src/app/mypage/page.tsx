import type { Metadata } from "next";
import { MyPage } from "@/components/pages/MyPage/MyPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "다시 앱 설치와 약관·문의 안내",
  alternates: { canonical: absoluteUrl("/mypage") },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <MyPage />;
}
