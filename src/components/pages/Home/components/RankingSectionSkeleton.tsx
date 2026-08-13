import { Skeleton } from "@/components/ui/skeleton";

export function RankingSectionSkeleton() {
  return (
    <section className="delay-appear flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-hidden px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex w-32 flex-shrink-0 flex-col gap-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </section>
  );
}
