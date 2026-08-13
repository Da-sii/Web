import { Skeleton } from "@/components/ui/skeleton";
import { DelayedSkeletonScreen } from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen>
      {/* 대표 이미지 */}
      <Skeleton className="h-[46vh] w-full rounded-none" />

      {/* 브랜드 · 제품명 · 평점 */}
      <div className="flex flex-col gap-2 border-b border-gray100 px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-28" />
      </div>

      {/* 랭킹 표 */}
      <div className="flex flex-col gap-2 border-b border-gray100 px-5 py-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* 탭 */}
      <div className="grid grid-cols-2 border-b border-gray100">
        <div className="flex justify-center py-3">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-center py-3">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* 성분 카드 */}
      <div className="flex flex-col gap-3 px-5 py-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-[#F6F5FA] px-4 py-4">
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="size-[74px] shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </DelayedSkeletonScreen>
  );
}
