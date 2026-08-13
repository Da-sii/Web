import { Skeleton } from "@/components/ui/skeleton";
import { DelayedSkeletonScreen } from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen className="flex-row">
      {/* 대분류 레일 */}
      <div className="flex min-w-[127px] flex-col gap-1 bg-gray50 p-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      {/* 중분류 + 소분류 */}
      <div className="flex flex-1 flex-col gap-6 px-5 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}
      </div>
    </DelayedSkeletonScreen>
  );
}
