import { Skeleton } from "@/components/ui/skeleton";
import { DelayedSkeletonScreen } from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen className="pb-6">
      <div className="px-4 pt-3 pb-2">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
      <div className="flex flex-col gap-3 px-4 pt-6">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="size-4 rounded-md" />
          </div>
        ))}
      </div>
    </DelayedSkeletonScreen>
  );
}
