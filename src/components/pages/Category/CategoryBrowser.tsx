"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ICategory } from "@/types/models";

interface CategoryBrowserProps {
  categories: ICategory[];
}

function buildHref(main: string, opts: { middle?: string; sub?: string }) {
  const params = new URLSearchParams();
  params.set("main", main);
  if (opts.middle) params.set("middle", opts.middle);
  if (opts.sub) params.set("sub", opts.sub);
  return `/category/list?${params.toString()}`;
}

export function CategoryBrowser({ categories }: CategoryBrowserProps) {
  const [selected, setSelected] = useState<string>(
    categories[0]?.category ?? "",
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.category === selected) ?? categories[0],
    [categories, selected],
  );

  if (categories.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-20 text-sm text-muted-foreground">
        카테고리 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1">
      <aside className="w-[32%] shrink-0 border-r border-gray100 bg-gray-50">
        <ul className="flex flex-col">
          {categories.map((c) => {
            const isActive = c.category === selectedCategory?.category;
            return (
              <li key={c.category}>
                <button
                  type="button"
                  onClick={() => setSelected(c.category)}
                  className={cn(
                    "w-full px-4 py-4 text-left text-sm",
                    isActive
                      ? "bg-background font-bold text-foreground"
                      : "font-medium text-muted-foreground",
                  )}
                >
                  {c.category}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="flex flex-1 flex-col divide-y divide-gray100 px-5">
        {selectedCategory?.middleCategories.map((middle) => (
          <div key={middle.category} className="flex flex-col py-4">
            <Link
              href={buildHref(selectedCategory.category, {
                middle: middle.category,
              })}
              className="self-start py-2 text-sm font-bold"
            >
              {middle.category}
            </Link>
            <ul className="flex flex-col">
              {middle.smallCategories.map((small) => (
                <li key={small}>
                  <Link
                    href={buildHref(selectedCategory.category, {
                      middle: middle.category,
                      sub: small,
                    })}
                    className="block py-2 text-sm text-muted-foreground"
                  >
                    {small}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
