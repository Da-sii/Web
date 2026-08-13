import { Skeleton } from "@/components/ui/skeleton";
import { DelayedSkeletonScreen } from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen className="gap-5 px-5 py-5">
      <Skeleton className="h-6 w-1/2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-xl" />
    </DelayedSkeletonScreen>
  );
}
