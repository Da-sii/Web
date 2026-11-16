"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PendingLink } from "@/components/commons/NavProgress";
import Icon from "@/components/commons/Icon/Icon";
import { Button } from "@/components/ui/button";

/**
 * /category/list 의 헤더.
 *
 * 이 라우트는 레이아웃 Header 가 null 을 돌려주고 페이지가 헤더를 직접 그린다.
 * 그래서 loading.tsx 도 같은 헤더를 그려야 이동 중에 헤더가 사라지지 않는다.
 * 대분류 선택 다이얼로그는 페이지에만 있으므로 onTitleClick 을 넘기지 않으면
 * 제목이 버튼이 아닌 정적 텍스트로 렌더된다.
 */
export function CategoryListHeader({
  bigCategory,
  onTitleClick,
}: {
  bigCategory: string;
  onTitleClick?: () => void;
}) {
  const router = useRouter();
  const title = bigCategory || "전체";

  return (
    <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center border-b border-gray100 bg-background px-4">
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

      {onTitleClick ? (
        <button
          type="button"
          onClick={onTitleClick}
          className="justify-self-center flex items-center gap-1 text-base font-bold text-gray900"
        >
          {title}
          <ChevronDown className="size-4" />
        </button>
      ) : (
        <span className="justify-self-center flex items-center gap-1 text-base font-bold text-gray900">
          {title}
          <ChevronDown className="size-4" />
        </span>
      )}

      <PendingLink href="/search" aria-label="검색" className="justify-self-end">
        <Icon icon="IC_Search" size="md" />
      </PendingLink>
    </header>
  );
}
