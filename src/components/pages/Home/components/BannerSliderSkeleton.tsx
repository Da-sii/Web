import { Skeleton } from "@/components/ui/skeleton";

export function BannerSliderSkeleton() {
  return (
    <section className="relative">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <Skeleton className="absolute right-3 bottom-3 h-5 w-12 rounded-full" />
    </section>
  );
}
