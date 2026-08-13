import { Skeleton } from "@/components/ui/skeleton";
import { DelayedSkeletonScreen } from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen>
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[10/13] w-full rounded-none" />
      ))}
    </DelayedSkeletonScreen>
  );
}
