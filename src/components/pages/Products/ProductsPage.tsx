"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/commons/ProductCard";
import { ProductListRow } from "@/components/commons/ProductListRow";
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

interface ProductsPageProps {
  initialProducts: Product[];
  initialCount: number;
  categories: Category[];
  initialBigCategory: string;
  initialMiddleCategory: string;
  initialSmallCategory: string;
  initialSort: ProductSortOption;
}

export function ProductsPage({
  initialProducts,
  initialCount,
  categories,
  initialBigCategory,
  initialMiddleCategory,
  initialSmallCategory,
  initialSort,
}: ProductsPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [activeMiddle, setActiveMiddle] = useState(initialMiddleCategory);
  const [activeSmall, setActiveSmall] = useState(initialSmallCategory);
  const [sort, setSort] = useState<ProductSortOption>(initialSort);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bigCategoryDialogOpen, setBigCategoryDialogOpen] = useState(false);

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

  const refetch = useCallback(
    async (opts: {
      middle: string;
      small: string;
      sortOpt: ProductSortOption;
      resetPage?: boolean;
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

  const handleMiddleChange = (middle: string) => {
    setActiveMiddle(middle);
    setActiveSmall("");
    refetch({ middle, small: "", sortOpt: sort });
  };

  const handleSmallChange = (small: string) => {
    const next = small === activeSmall ? "" : small;
    setActiveSmall(next);
    refetch({ middle: activeMiddle, small: next, sortOpt: sort });
  };

  const handleSortChange = (nextSort: ProductSortOption) => {
    setSort(nextSort);
    refetch({ middle: activeMiddle, small: activeSmall, sortOpt: nextSort });
  };

  const handleLoadMore = async () => {
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
  };

  const handleBigCategoryChange = (cat: string) => {
    setBigCategoryDialogOpen(false);
    router.push(`/products?main=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Big category header */}
      <div className="flex items-center justify-between border-b border-gray100 px-4 py-3">
        <button
          type="button"
          onClick={() => setBigCategoryDialogOpen(true)}
          className="flex items-center gap-1 text-base font-bold text-gray900"
        >
          {initialBigCategory || "전체"}
          <ChevronDown className="size-4" />
        </button>
      </div>

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
      ) : viewMode === "grid" ? (
        <div data-testid="product-grid" className="grid grid-cols-2 gap-3 px-4 py-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <ul data-testid="product-list" className="flex flex-col divide-y divide-gray100">
          {products.map((p) => (
            <li key={p.id}>
              <ProductListRow product={p} />
            </li>
          ))}
        </ul>
      )}

      {/* Load more */}
      {hasNext && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={cn(
              "rounded-full border border-gray200 px-6 py-2 text-sm text-gray700",
              loadingMore && "opacity-50",
            )}
          >
            {loadingMore ? "불러오는 중..." : "더 보기"}
          </button>
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
