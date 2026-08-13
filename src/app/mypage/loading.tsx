import { Skeleton } from "@/components/ui/skeleton";
import { DelayedSkeletonScreen } from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen className="gap-7 px-5 py-5">
      <Skeleton className="h-56 w-full rounded-2xl" />
      {Array.from({ length: 2 }).map((_, section) => (
        <div key={section} className="flex flex-col gap-3">
          <Skeleton className="h-3 w-12" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </DelayedSkeletonScreen>
  );
}
