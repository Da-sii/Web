"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Icon from "@/components/commons/Icon/Icon";

const BANNER_DETAIL_PATTERN = /^\/banners\/[^/]+$/;
const SEARCH_PATTERN = /^\/search(?:\/.*)?$/;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname && SEARCH_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center bg-background px-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="flex justify-self-start p-1"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </button>
        <h1 className="justify-self-center text-base font-semibold">검색</h1>
        <span aria-hidden className="justify-self-end" />
      </header>
    );
  }

  if (pathname && BANNER_DETAIL_PATTERN.test(pathname)) {
    const handleShare = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("링크가 복사되었습니다");
      } catch {
        toast.error("링크 복사에 실패했습니다");
      }
    };

    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center border-b bg-background px-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="flex justify-self-start p-1"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </button>
        <h1 className="justify-self-center text-base font-semibold">뉴스</h1>
        <button
          type="button"
          onClick={handleShare}
          aria-label="링크 공유"
          className="flex justify-self-end p-1"
        >
          <Icon icon="IC_Share" size="md" />
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4">
      <Link href="/" aria-label="홈으로 이동">
        <Image
          src="/images/logo.png"
          alt="다시 로고"
          width={100}
          height={18}
          className="h-4.5 w-auto"
        />
      </Link>
      <Link href="/search" aria-label="검색">
        <Icon icon="IC_Search" size="md" />
      </Link>
    </header>
  );
}
