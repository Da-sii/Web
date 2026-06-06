import Image from "next/image"
import Link from "next/link"

import { ArrowToggle } from "@/components/commons/ArrowToggle"

const businessInfo = [
  { label: "상호명", value: "포도상점" },
  { label: "대표자", value: "서준" },
  { label: "주소", value: "서울시 노원구 석계로 98-2 3층 스타트업 스테이션" },
  { label: "사업자등록번호", value: "196-64-00773" },
  { label: "이메일", value: "podosangjeom@gmail.com" },
] as const

export function Bottom() {
  return(
    <footer className="flex flex-col border-t px-5 py-5 items-start gap-3">
      <Image
        src="/images/logo_text.png"
        width={50}
        height={30}
        alt='로고'
      />
      <ArrowToggle label="사업자정보" variant="gray" className="w-full">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-xs">
          {businessInfo.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="text-gray-400">{label}</dt>
              <dd className="text-gray-400 break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </ArrowToggle>
      <div className="flex gap-3 text-xs underline text-gray-600">
        <Link href="/terms/footerService">서비스 이용 약관</Link>
        <Link href="/terms/footerPrivacyUsage">개인정보 처리방침</Link>
        <Link href="/terms/footerReviewPolicy">리뷰운영정책</Link>
        <Link href="/inquiry">광고/제휴 문의</Link>
      </div>
    </footer>
  )
}