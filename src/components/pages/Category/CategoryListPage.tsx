"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { fetchProducts } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/commons/ProductCard";
import { ProductListRow } from "@/components/commons/ProductListRow";
import Icon from "@/components/commons/Icon/Icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TabSwitcher } from "./components/TabSwitcher";
import { SubcategoryFilter } from "./components/SubcategoryFilter";
import { ProductsToolbar } from "./components/ProductsToolbar";
import type { Category, Product, ProductSortOption } from "@/types/models";

interface CategoryListPageProps {
  initialProducts: Product[];
  initialCount: number;
  initialHasNext: boolean;
  categories: Category[];
  initialBigCategory: string;
  initialMiddleCategory: string;
  initialSmallCategory: string;
  initialSort: ProductSortOption;
}

export function CategoryListPage({
  initialProducts,
  initialCount,
  initialHasNext,
  categories,
  initialBigCategory,
  initialMiddleCategory,
  initialSmallCategory,
  initialSort,
}: CategoryListPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [activeMiddle, setActiveMiddle] = useState(initialMiddleCategory);
  const [activeSmall, setActiveSmall] = useState(initialSmallCategory);
  const [sort, setSort] = useState<ProductSortOption>(initialSort);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bigCategoryDialogOpen, setBigCategoryDialogOpen] = useState(false);

  // Virtual DOM refs
  const gridDivRef = useRef<HTMLDivElement>(null);
  const gridUlRef = useRef<HTMLUListElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  const targetCategory = useMemo(
    () => categories.find((c) => c.category === initialBigCategory),
    [categories, initialBigCategory],
  );

  const middleTabs = useMemo(
    () => targetCategory?.middleCategories.map((m) => m.category) ?? [],
    [targetCategory],
  );

  const smallOptions = useMemo(() => {
    if (!targetCategory || !activeMiddle) return [];
    return (
      targetCategory.middleCategories.find((m) => m.category === activeMiddle)
        ?.smallCategories ?? []
    );
  }, [targetCategory, activeMiddle]);

  // Grid rows for virtualizer (2 per row)
  const gridRows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      result.push(products.slice(i, i + 2));
    }
    return result;
  }, [products]);

  // Find scroll container once on mount
  useEffect(() => {
    scrollContainerRef.current = document.querySelector("[data-scroll-root]") as HTMLElement | null;
  }, []);

  // Recalculate scrollMargin when layout above the grid may change
  useEffect(() => {
    const grid = viewMode === "grid" ? gridDivRef.current : gridUlRef.current;
    const scrollEl = scrollContainerRef.current;
    if (!grid || !scrollEl) return;
    setScrollMargin(
      grid.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop,
    );
  }, [activeMiddle, activeSmall, loading, viewMode]);

  // Virtualizers (always called — React hook rules)
  const gridVirtualizer = useVirtualizer({
    count: gridRows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 260,
    overscan: 3,
    scrollMargin,
  });

  const listVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 120,
    overscan: 5,
    scrollMargin,
  });

  const buildUrl = useCallback(
    (middle: string, sub: string, sortOpt: ProductSortOption) => {
      const p = new URLSearchParams();
      if (initialBigCategory) p.set("main", initialBigCategory);
      if (middle) p.set("middle", middle);
      if (sub) p.set("sub", sub);
      if (sortOpt !== "monthly_rank") p.set("sort", sortOpt);
      return `/category/list?${p.toString()}`;
    },
    [initialBigCategory],
  );

  const refetch = useCallback(
    async (opts: {
      middle: string;
      small: string;
      sortOpt: ProductSortOption;
    }) => {
      setLoading(true);
      try {
        const { results, count, next } = await fetchProducts({
          bigCategory: initialBigCategory,
          middleCategory: opts.middle || undefined,
          smallCategory: opts.small || undefined,
          sort: opts.sortOpt,
          page: 1,
        });
        setProducts(results);
        setTotalCount(count);
        setHasNext(next !== null);
        setPage(1);
      } finally {
        setLoading(false);
      }
    },
    [initialBigCategory],
  );

  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { results, next } = await fetchProducts({
        bigCategory: initialBigCategory,
        middleCategory: activeMiddle || undefined,
        smallCategory: activeSmall || undefined,
        sort,
        page: nextPage,
      });
      setProducts((prev) => [...prev, ...results]);
      setHasNext(next !== null);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, initialBigCategory, activeMiddle, activeSmall, sort]);

  // Infinite scroll sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext && !loadingMore) handleLoadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNext, loadingMore, handleLoadMore]);

  const handleMiddleChange = (middle: string) => {
    setActiveMiddle(middle);
    setActiveSmall("");
    window.history.replaceState(null, "", buildUrl(middle, "", sort));
    refetch({ middle, small: "", sortOpt: sort });
  };

  const handleSmallChange = (small: string) => {
    const next = small === activeSmall ? "" : small;
    setActiveSmall(next);
    window.history.replaceState(null, "", buildUrl(activeMiddle, next, sort));
    refetch({ middle: activeMiddle, small: next, sortOpt: sort });
  };

  const handleSortChange = (nextSort: ProductSortOption) => {
    setSort(nextSort);
    window.history.replaceState(null, "", buildUrl(activeMiddle, activeSmall, nextSort));
    refetch({ middle: activeMiddle, small: activeSmall, sortOpt: nextSort });
  };

  const handleBigCategoryChange = (cat: string) => {
    setBigCategoryDialogOpen(false);
    router.push(`/category/list?main=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Merged header */}
      <header className="sticky top-0 z-40 grid h-14 w-full grid-cols-3 items-center border-b border-gray100 bg-background px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <Icon icon="IC_ArrowLeft" size="md" />
        </Button>
        <button
          type="button"
          onClick={() => setBigCategoryDialogOpen(true)}
          className="justify-self-center flex items-center gap-1 text-base font-bold text-gray900"
        >
          {initialBigCategory || "전체"}
          <ChevronDown className="size-4" />
        </button>
        <Link href="/search" aria-label="검색" className="justify-self-end">
          <Icon icon="IC_Search" size="md" />
        </Link>
      </header>

      {/* Tab switcher */}
      {middleTabs.length > 0 && (
        <TabSwitcher tabs={middleTabs} activeTab={activeMiddle} onTabChange={handleMiddleChange} />
      )}

      {/* Small category filter */}
      {smallOptions.length > 0 && (
        <SubcategoryFilter
          options={smallOptions}
          activeOption={activeSmall}
          onSelect={handleSmallChange}
        />
      )}

      {/* Toolbar */}
      <ProductsToolbar
        totalCount={totalCount}
        sort={sort}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Product list / grid */}
      {loading ? (
        <div
          data-testid="product-grid"
          className="grid grid-cols-2 gap-3 px-4 py-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray50" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-sm text-gray400">
          <span>제품을 준비중이에요!</span>
          <span>조금만 기다려주세요</span>
        </div>
      ) : viewMode === "grid" ? (
        <div
          ref={gridDivRef}
          data-testid="product-grid"
          style={{ height: `${gridVirtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {gridVirtualizer.getVirtualItems().map((vRow) => (
            <div
              key={vRow.key}
              data-index={vRow.index}
              ref={gridVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vRow.start - scrollMargin}px)`,
              }}
            >
              <div className="grid grid-cols-2 gap-3 px-4 py-1.5">
                {gridRows[vRow.index]?.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul
          ref={gridUlRef}
          data-testid="product-list"
          style={{ height: `${listVirtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {listVirtualizer.getVirtualItems().map((vItem) => (
            <li
              key={vItem.key}
              data-index={vItem.index}
              ref={listVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vItem.start - scrollMargin}px)`,
              }}
            >
              <ProductListRow product={products[vItem.index]} />
            </li>
          ))}
        </ul>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-gray400" />
        </div>
      )}

      {/* Big category dialog */}
      <Dialog open={bigCategoryDialogOpen} onOpenChange={setBigCategoryDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>카테고리 선택</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => handleBigCategoryChange(cat.category)}
                className={cn(
                  "rounded-lg px-4 py-3 text-left text-sm",
                  cat.category === initialBigCategory
                    ? "font-bold text-gray900"
                    : "text-gray400",
                )}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
