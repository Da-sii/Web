import { Skeleton } from "@/components/ui/skeleton";

export function BannerSliderSkeleton() {
  return (
    <section className="py-2">
      <div className="flex justify-center px-[7.5%]">
        <Skeleton className="aspect-square w-full rounded-2xl" />
      </div>
    </section>
  );
}
