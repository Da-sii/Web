import { Skeleton } from "@/components/ui/skeleton";
import {
  DelayedSkeletonScreen,
  TextLinesSkeleton,
} from "@/components/commons/LoadingSkeletons";

export default function Loading() {
  return (
    <DelayedSkeletonScreen className="gap-6 px-5 py-5">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <TextLinesSkeleton count={7} />
      <Skeleton className="h-11 w-full rounded-xl" />
    </DelayedSkeletonScreen>
  );
}
