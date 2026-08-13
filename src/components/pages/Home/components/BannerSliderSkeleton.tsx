import { Skeleton } from "@/components/ui/skeleton";

/**
 * BannerSlider 와 같은 기하(가운데 슬라이드 = 컨테이너 폭의 78%)를 쓴다.
 * 폭이 어긋나면 실제 슬라이더로 교체될 때 레이아웃이 튄다.
 */
export function BannerSliderSkeleton() {
  return (
    <section className="delay-appear py-2">
      <div className="flex justify-center px-[11%]">
        <Skeleton className="aspect-square w-full rounded-2xl" />
      </div>
    </section>
  );
}
