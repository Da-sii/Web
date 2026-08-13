"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Icon from "@/components/commons/Icon/Icon";
import type { Category, MiddleCategory } from "@/types/models";

interface CategoryPageProps {
  categories: Category[];
}

/** sub 를 생략하면 해당 중분류 "전체" 로 들어간다 (앱 goToList 와 동일). */
function buildCategoryListUrl(
  main: string,
  middle: string,
  sub?: string,
): string {
  const params = new URLSearchParams({ main, middle });
  if (sub) params.set("sub", sub);
  return `/category/list?${params.toString()}`;
}

function MiddleCategorySection({
  item,
  bigCategory,
}: {
  item: MiddleCategory;
  bigCategory: string;
}) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between py-4">
        <span className="text-sm font-bold text-gray900">{item.category}</span>
        <Link
          href={buildCategoryListUrl(bigCategory, item.category)}
          className="flex items-center"
        >
          <Icon icon="IC_ArrowRight" size="xs" className="text-gray900" />
        </Link>
      </div>
      <div className="mb-3 flex flex-col">
        {item.smallCategories.map((small) => (
          <Link
            key={small}
            href={buildCategoryListUrl(bigCategory, item.category, small)}
            className="py-2 text-sm text-gray700"
          >
            {small}
          </Link>
        ))}
      </div>
      <hr className="border-gray100" />
    </div>
  );
}

export function CategoryPage({ categories }: CategoryPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBig = categories[activeIndex];

  return (
    <div className="flex h-full overflow-hidden">
      {/* 대분류 */}
      <div className="flex min-w-[127px] flex-shrink-0 flex-col overflow-y-auto bg-gray50 no-scrollbar">
        {categories.map((cat, i) => (
          <button
            key={cat.category}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              "w-full px-3 py-4 text-left text-sm",
              i === activeIndex
                ? "bg-white font-semibold text-gray900"
                : "bg-gray50 font-normal text-gray400",
            )}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* 중분류 + 소분류 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeBig?.middleCategories.map((middle) => (
          <MiddleCategorySection
            key={middle.category}
            item={middle}
            bigCategory={activeBig.category}
          />
        ))}
      </div>
    </div>
  );
}
