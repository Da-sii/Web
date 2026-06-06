"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchRanking } from "@/lib/api";
import { RankingItem } from "./components/RankingItem";
import type { RankingCategoryItem, RankingPeriod, RankingProduct } from "@/types/models";

interface RankingPageProps {
  initialProducts: RankingProduct[];
  initialPeriod: RankingPeriod;
  categories: RankingCategoryItem[];
}

export function RankingPage({ initialProducts, initialPeriod, categories }: RankingPageProps) {
  const [period, setPeriod] = useState<RankingPeriod>(initialPeriod);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<RankingProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const smallCategories = Array.from(
    new Set(categories.map((c) => c.smallCategory).filter(Boolean)),
  );

  const refetch = useCallback(
    async (nextPeriod: RankingPeriod, nextCategory: string | undefined) => {
      setLoading(true);
      try {
        const { results } = await fetchRanking({
          period: nextPeriod,
          category: nextCategory,
        });
        setProducts(results);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handlePeriodChange = (next: RankingPeriod) => {
    setPeriod(next);
    setActiveCategory(undefined);
    refetch(next, undefined);
  };

  const handleCategoryChange = (cat: string | undefined) => {
    setActiveCategory(cat);
    refetch(period, cat);
  };

  const handleReset = () => {
    setPeriod("daily");
    setActiveCategory(undefined);
    refetch("daily", undefined);
  };

  return (
    <div className="flex flex-col">
      {/* period tabs */}
      <div className="flex border-b border-gray100">
        <button
          type="button"
          onClick={() => handlePeriodChange("daily")}
          className={cn(
            "px-4 py-3 text-xs",
            period === "daily" ? "border-b-2 border-gray900 font-bold text-gray900" : "text-gray400",
          )}
        >
          현재 급상승 랭킹
        </button>
        <button
          type="button"
          onClick={() => handlePeriodChange("monthly")}
          className={cn(
            "px-4 py-3 text-xs",
            period === "monthly" ? "border-b-2 border-gray900 font-bold text-gray900" : "text-gray400",
          )}
        >
          월간 랭킹
        </button>
      </div>

      {/* category filter */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {["전체", ...smallCategories].map((cat) => {
          const isActive = cat === "전체" ? activeCategory === undefined : activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat === "전체" ? undefined : cat)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs",
                isActive
                  ? "bg-green500 text-white"
                  : "border border-gray200 bg-white text-gray700",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* reset row */}
      <div className="flex items-center justify-between px-4 pb-1">
        {period === "daily" ? (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray400"
          >
            <span>↺</span>
            <span>초기화</span>
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* list */}
      {loading ? (
        <div className="flex flex-col">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-26 animate-pulse border-b border-gray100 bg-gray50 px-4 py-3" />
          ))}
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-gray100">
          {products.map((product, index) => (
            <li key={product.id}>
              <RankingItem product={product} rank={index + 1} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
