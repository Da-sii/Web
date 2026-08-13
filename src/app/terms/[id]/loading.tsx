import { Skeleton } from "@/components/ui/skeleton";
import {
  DelayedSkeletonScreen,
  TextLinesSkeleton,
} from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen className="gap-5 px-5 py-5">
      <Skeleton className="h-6 w-2/3" />
      <TextLinesSkeleton count={12} />
    </DelayedSkeletonScreen>
  );
}
