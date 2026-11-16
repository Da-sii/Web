"use client";

import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DelayedSkeletonScreen,
  ProductGridSkeleton,
} from "@/components/commons/LoadingSkeletons";
import { CategoryListHeader } from "@/components/pages/Category/components/CategoryListHeader";

/**
 * 이 라우트는 레이아웃 Header 가 null 이라 스켈레톤까지 지연시키면
 * 이동하는 동안 헤더가 통째로 사라진다. 헤더는 지연 밖에서 즉시 그리고,
 * 본문 스켈레톤만 delay-appear 로 감싼다.
 */
export default function Loading() {
  const searchParams = useSearchParams();

  return (
    <div className="flex w-full flex-col">
      <CategoryListHeader bigCategory={searchParams.get("main") ?? ""} />

      <DelayedSkeletonScreen>
        {/* 중분류 탭 */}
        <div className="flex gap-4 border-b border-gray100 px-4 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        {/* 소분류 칩 */}
        <div className="flex gap-2 px-4 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        {/* 툴바 */}
        <div className="flex items-center justify-between px-4 py-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <ProductGridSkeleton />
      </DelayedSkeletonScreen>
    </div>
  );
}
