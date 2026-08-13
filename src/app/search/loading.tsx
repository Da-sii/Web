import { Skeleton } from "@/components/ui/skeleton";
import {
  DelayedSkeletonScreen,
  ProductRowsSkeleton,
} from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen>
      <div className="px-4 pt-3 pb-2">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
      <ProductRowsSkeleton count={6} />
    </DelayedSkeletonScreen>
  );
}
