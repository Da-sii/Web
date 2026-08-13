import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * loading.tsx 들이 공유하는 스켈레톤 조각.
 * 루트에 `delay-appear` 를 두어 1초 안에 끝나는 이동에서는 아예 보이지 않게 한다
 * (globals.css). 그 사이의 피드백은 상단 NavProgressBar 가 담당한다.
 */
export function DelayedSkeletonScreen({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn("delay-appear flex w-full flex-col", className)}
    >
      {children}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 py-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ProductRowsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 px-4 py-3">
          <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col justify-between py-0.5">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 페이지가 자체 헤더를 그리는 라우트용 (제품 목록 등) */
export function PageHeaderSkeleton() {
  return (
    <div className="grid h-14 w-full grid-cols-3 items-center border-b border-gray100 px-4">
      <Skeleton className="size-5 justify-self-start rounded-md" />
      <Skeleton className="h-5 w-24 justify-self-center" />
      <Skeleton className="size-5 justify-self-end rounded-md" />
    </div>
  );
}

export function TextLinesSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 - (i % 3) * 12}%` }}
        />
      ))}
    </div>
  );
}
