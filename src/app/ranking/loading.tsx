import { Skeleton } from "@/components/ui/skeleton";
import {
  DelayedSkeletonScreen,
  ProductRowsSkeleton,
} from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen>
      {/* 기간 탭 */}
      <div className="flex gap-4 border-b border-gray100 px-4 py-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* 소분류 칩 */}
      <div className="flex gap-2 px-4 py-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <ProductRowsSkeleton count={10} />
    </DelayedSkeletonScreen>
  );
}
