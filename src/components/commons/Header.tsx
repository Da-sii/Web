"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/commons/Icon/Icon";
import { Button } from "@/components/ui/button";
import { getTermById } from "@/lib/terms";

const BANNER_DETAIL_PATTERN = /^\/banners\/[^/]+$/;
const SEARCH_PATTERN = /^\/search(?:\/.*)?$/;
const TERMS_DETAIL_PATTERN = /^\/terms\/([^/]+)$/;
const INQUIRY_PATTERN = /^\/inquiry(?:\/.*)?$/;
const INGREDIENT_GUIDES_PATTERN = /^\/ingredients\/guides(?:\/[^/]+)?\/?$/;
const PRODUCT_DETAIL_PATTERN = /^\/products\/[^/]+$/;
const CATEGORY_PATTERN = /^\/category(?:\/.*)?$/;
const RANKING_PATTERN = /^\/ranking(?:\/.*)?$/;
const PRODUCTS_LIST_PATTERN = /^\/products\/?$/;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname && CATEGORY_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center border-b bg-background px-4">
        <span aria-hidden className="justify-self-start" />
        <h1 className="justify-self-center text-base font-semibold">카테고리</h1>
        <Link href="/search" aria-label="검색" className="justify-self-end">
          <Icon icon="IC_Search" size="md" />
        </Link>
      </header>
    );
  }

  if (pathname && RANKING_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center border-b bg-background px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <h1 className="justify-self-center text-base font-semibold">랭킹</h1>
        <Link href="/search" aria-label="검색" className="justify-self-end">
          <Icon icon="IC_Search" size="md" />
        </Link>
      </header>
    );
  }

  if (pathname && PRODUCTS_LIST_PATTERN.test(pathname)) {
    return null;
  }

  if (pathname && INQUIRY_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center bg-background px-4">
        <span aria-hidden className="justify-self-start" />
        <h1 className="justify-self-center text-base font-semibold">광고/제휴 문의</h1>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="닫기"
          className="justify-self-end"
        >
          <X className="size-5" />
        </Button>
      </header>
    );
  }

  if (pathname && PRODUCT_DETAIL_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-background px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/search")}
            aria-label="검색"
          >
            <Icon icon="IC_Search" size="md" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            aria-label="홈으로 이동"
          >
            <Icon icon="IC_Home" size="md" />
          </Button>
        </div>
      </header>
    );
  }

  if (pathname && INGREDIENT_GUIDES_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center bg-background px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <h1 className="justify-self-center text-base font-semibold">성분 가이드</h1>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          aria-label="홈으로 이동"
          className="justify-self-end"
        >
          <Icon icon="IC_Home" size="md" />
        </Button>
      </header>
    );
  }

  if (pathname && SEARCH_PATTERN.test(pathname)) {
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center bg-background px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <h1 className="justify-self-center text-base font-semibold">검색</h1>
        <span aria-hidden className="justify-self-end" />
      </header>
    );
  }

  const termsMatch = pathname?.match(TERMS_DETAIL_PATTERN);
  if (termsMatch) {
    const term = getTermById(termsMatch[1]);
    return (
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center border-b bg-background px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <h1 className="justify-self-center text-base font-semibold">
          {term?.title ?? ""}
        </h1>
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <h1 className="justify-self-center text-base font-semibold">뉴스</h1>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleShare}
          aria-label="링크 공유"
          className="justify-self-end"
        >
          <Icon icon="IC_Share" size="md" />
        </Button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-background px-4">
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
