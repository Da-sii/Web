import Image from "next/image";
import {
  ANDROID_STORE_URL,
  IOS_STORE_URL,
  STORE_QR,
} from "@/lib/app-store";

/**
 * 마이페이지 상단 앱 설치 유도 카드.
 * 모바일에서는 스토어 버튼으로, 데스크톱(md+)에서는 QR로 설치를 유도한다.
 */
export function AppInstallCard() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl bg-[#F6F5FA] px-5 py-7 text-center">
      <Image
        src="/images/logo.png"
        alt="다시 로고"
        width={96}
        height={18}
        className="h-4.5 w-auto"
      />
      <div className="flex flex-col gap-1">
        <p className="text-base font-bold text-gray900">
          앱에서 더 많은 기능을 만나보세요
        </p>
        <p className="text-xs text-gray-500">
          리뷰 작성, 성분 비교, 관심 제품 저장까지
          <br />
          다시 앱에서 모두 이용할 수 있어요.
        </p>
      </div>

      <div className="flex w-full max-w-72 gap-2">
        <a
          href={ANDROID_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-green600 text-sm font-semibold text-white"
        >
          Android 설치
        </a>
        <a
          href={IOS_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-white"
        >
          iPhone 설치
        </a>
      </div>

      <div className="hidden w-full max-w-72 gap-4 md:flex">
        {[
          { href: ANDROID_STORE_URL, src: STORE_QR.android, label: "Android" },
          { href: IOS_STORE_URL, src: STORE_QR.ios, label: "iPhone" },
        ].map((qr) => (
          <a
            key={qr.label}
            href={qr.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <Image
              src={qr.src}
              alt={`${qr.label} 설치 QR`}
              width={104}
              height={104}
              className="rounded-lg bg-white"
            />
            <span className="text-xs font-semibold text-gray-500">
              {qr.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
