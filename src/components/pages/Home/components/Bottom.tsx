import Icon from "@/components/commons/Icon/Icon"
import Image from "next/image"
import Link from "next/link"

export function Bottom() {
  return(
    <footer className="flex flex-col border-t px-5 py-5 items-start gap-3">
      <Image
        src="/images/logo_text.png"
        width={50}
        height={30}
        alt='로고'
      />
      <button className="flex text-gray-500 text-xs gap-1 items-center">
        <p>사업자정보</p>
        <Icon icon='IC_ArrowBottom' size="xs"/>
      </button>
      <div className="flex gap-3 text-xs underline text-gray-600">
        <Link href="">서비스 이용 약관</Link>
        <Link href="">개인정보 처리방침</Link>
        <Link href="">리뷰운영정책</Link>
        <Link href="">광고/제휴 문의</Link>
      </div>
    </footer>
  )
}