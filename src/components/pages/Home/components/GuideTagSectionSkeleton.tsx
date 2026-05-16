import { Skeleton } from "@/components/ui/skeleton";

export function GuideTagSectionSkeleton() {
  return (
    <section className="flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </section>
  );
}
