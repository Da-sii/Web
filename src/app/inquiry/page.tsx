import type { Metadata } from "next";
import { InquiryPage } from "@/components/pages/Inquiry/InquiryPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "광고/제휴 문의",
  description: "다시 광고 및 제휴 관련 문의를 접수합니다.",
  alternates: { canonical: absoluteUrl("/inquiry") },
};

export default function Page() {
  return <InquiryPage />;
}
