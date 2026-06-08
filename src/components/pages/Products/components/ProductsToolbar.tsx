"use client";

import { useState } from "react";
import { Grid2X2, List, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeLabel = SORT_OPTIONS.find((o) => o.id === sort)?.label ?? "랭킹순";

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray100 px-4 py-2">
        <span className="text-xs font-semibold text-gray900">총 {totalCount}개</span>
        <div className="flex items-center gap-3">
          {/* sort */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-gray900"
          >
            {activeLabel}
            <ChevronDown className="size-3" />
          </button>

          {/* view toggle — 현재 모드 아이콘만 표시 */}
          <button
            type="button"
            aria-label={viewMode === "grid" ? "리스트 뷰로 전환" : "그리드 뷰로 전환"}
            onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
            className="p-0.5 text-gray900"
          >
            {viewMode === "grid" ? (
              <Grid2X2 className="size-4" />
            ) : (
              <List className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* 정렬 바텀시트 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-2xl px-0 pb-8 gap-0 left-1/2! right-auto! w-full max-w-lg -translate-x-1/2"
          overlayClassName="left-1/2! right-auto! w-full max-w-lg -translate-x-1/2"
        >
          <div className="px-6 py-4 text-sm font-semibold text-gray900">정렬</div>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSortChange(opt.id);
                setSheetOpen(false);
              }}
              className="flex w-full items-center justify-between px-6 py-4"
            >
              <span
                className={cn(
                  "text-sm",
                  sort === opt.id ? "font-semibold text-gray900" : "text-gray400",
                )}
              >
                {opt.label}
              </span>
              {sort === opt.id && <Check className="size-4 text-gray900" />}
            </button>
          ))}
        </SheetContent>
      </Sheet>
    </>
  );
}
