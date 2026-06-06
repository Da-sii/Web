"use client";

import { useState } from "react";
import { Grid2X2, List, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductSortOption } from "@/types/models";

const SORT_OPTIONS: { id: ProductSortOption; label: string }[] = [
  { id: "monthly_rank", label: "랭킹순" },
  { id: "review_desc", label: "리뷰순" },
];

interface ProductsToolbarProps {
  totalCount: number;
  sort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function ProductsToolbar({
  totalCount,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ProductsToolbarProps) {
  const [open, setOpen] = useState(false);
  const activeLabel = SORT_OPTIONS.find((o) => o.id === sort)?.label ?? "랭킹순";

  return (
    <div className="relative flex items-center justify-between border-b border-gray100 px-4 py-2">
      <span className="text-xs text-gray500">총 {totalCount}개</span>
      <div className="flex items-center gap-3">
        {/* sort */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-gray900"
          >
            {activeLabel}
            <ChevronDown className="size-3" />
          </button>
          {open && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[100px] rounded-lg border border-gray100 bg-white py-1 shadow-md">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-xs hover:bg-gray50"
                >
                  <span className={sort === opt.id ? "font-bold text-gray900" : "text-gray400"}>
                    {opt.label}
                  </span>
                  {sort === opt.id && <Check className="size-3 text-green500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* view toggle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="그리드 뷰"
            onClick={() => onViewModeChange("grid")}
            className={cn("p-0.5", viewMode === "grid" ? "text-gray900" : "text-gray300")}
          >
            <Grid2X2 className="size-4" />
          </button>
          <button
            type="button"
            aria-label="리스트 뷰"
            onClick={() => onViewModeChange("list")}
            className={cn("p-0.5", viewMode === "list" ? "text-gray900" : "text-gray300")}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
