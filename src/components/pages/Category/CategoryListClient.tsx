"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInfiniteProducts } from "@/lib/use-infinite-products";
import type { ICategory, ProductSort } from "@/types/models";
import { BigCategoryDialog } from "./BigCategoryDialog";
import { SortDropdown } from "./SortDropdown";
import { ProductCard } from "./ProductCard";

interface CategoryListClientProps {
  categories: ICategory[];
  initialMain: string;
  initialMiddle: string;
  initialSub: string;
}

const ALL = "전체";

function buildQueryString(main: string, middle: string, sub: string) {
  const params = new URLSearchParams();
  params.set("main", main);
  if (middle && middle !== ALL) params.set("middle", middle);
  if (sub && sub !== ALL) params.set("sub", sub);
  return `/category/list?${params.toString()}`;
}

export function CategoryListClient({
  categories,
  initialMain,
  initialMiddle,
  initialSub,
}: CategoryListClientProps) {
  const router = useRouter();
  const [bigCategory, setBigCategory] = useState(initialMain);
  const [activeMiddle, setActiveMiddle] = useState(initialMiddle);
  const [activeSmall, setActiveSmall] = useState(initialSub);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<ProductSort>("monthly_rank");

  const currentBig = useMemo(
    () => categories.find((c) => c.category === bigCategory) ?? categories[0],
    [categories, bigCategory],
  );

  const middleList = currentBig?.middleCategories ?? [];
  const currentMiddle = useMemo(() => {
    if (activeMiddle === ALL) return null;
    return middleList.find((m) => m.category === activeMiddle) ?? null;
  }, [middleList, activeMiddle]);
  const smallList = currentMiddle?.smallCategories ?? [];

  // sync URL when state changes
  useEffect(() => {
    router.replace(buildQueryString(bigCategory, activeMiddle, activeSmall), {
      scroll: false,
    });
  }, [router, bigCategory, activeMiddle, activeSmall]);

  const handleSelectBig = useCallback(
    (next: string) => {
      const nextCat = categories.find((c) => c.category === next);
      const firstMiddle = nextCat?.middleCategories[0]?.category ?? ALL;
      setBigCategory(next);
      setActiveMiddle(firstMiddle);
      setActiveSmall(ALL);
    },
    [categories],
  );

  const handleSelectMiddle = useCallback((next: string) => {
    setActiveMiddle(next);
    setActiveSmall(ALL);
  }, []);

  const { products, fetchNextPage, hasNextPage, isInitialLoading, isFetchingNextPage } =
    useInfiniteProducts({
      bigCategory,
      middleCategory: activeMiddle,
      smallCategory: activeSmall,
      sort,
    });

  // infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) fetchNextPage();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage]);

  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-14 z-20 flex flex-col gap-3 border-b border-gray100 bg-background pb-3">
        <div className="px-5 pt-4">
          <BigCategoryDialog
            categories={categories}
            current={bigCategory}
            onSelect={handleSelectBig}
          />
        </div>

        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
          {middleList.map((m) => {
            const isActive = m.category === activeMiddle;
            return (
              <button
                key={m.category}
                type="button"
                onClick={() => handleSelectMiddle(m.category)}
                className={cn(
                  "shrink-0 border-b-2 pb-1.5 text-sm",
                  isActive
                    ? "border-foreground font-bold text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {m.category}
              </button>
            );
          })}
        </div>

        {activeMiddle !== ALL && smallList.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
            {[ALL, ...smallList].map((s) => {
              const isActive = s === activeSmall;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveSmall(s)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs",
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-gray-100 text-muted-foreground",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-gray100 px-5 py-3">
        <SortDropdown value={sort} onChange={setSort} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="그리드 보기"
            onClick={() => setViewType("grid")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              viewType === "grid" ? "text-foreground" : "text-gray-300",
            )}
          >
            <LayoutGrid className="size-5" />
          </button>
          <button
            type="button"
            aria-label="리스트 보기"
            onClick={() => setViewType("list")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              viewType === "list" ? "text-foreground" : "text-gray-300",
            )}
          >
            <List className="size-5" />
          </button>
        </div>
      </div>

      {isInitialLoading ? (
        <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">
          불러오는 중…
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">
          해당 카테고리에 상품이 없습니다.
        </div>
      ) : viewType === "grid" ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-5 py-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} view="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} view="list" />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-10 w-full" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-xs text-muted-foreground">
          더 불러오는 중…
        </div>
      )}
    </div>
  );
}
