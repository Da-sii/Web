"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Icon from "@/components/commons/Icon/Icon";
import { Button } from "@/components/ui/button";
import { INGREDIENT_GUIDES_PAGE_SIZE } from "@/lib/api";
import type { IngredientGuide, PaginatedResponse } from "@/types/models";

const HOT_INGREDIENTS: ReadonlyArray<{ id: number; name: string }> = [
  { id: 1, name: "가르시니아 캄보지아 추출물" },
  { id: 2, name: "밀크씨슬추출물" },
  { id: 3, name: "녹차추출물" },
];

const MAX_VISIBLE_PAGES = 5;

interface IngredientGuidesPageProps {
  initialSearch: string;
  page: number;
  data: PaginatedResponse<IngredientGuide>;
}

export function IngredientGuidesPage({
  initialSearch,
  page,
  data,
}: IngredientGuidesPageProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialSearch);

  useEffect(() => {
    setKeyword(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("search", trimmed);
    const qs = params.toString();
    router.push(qs ? `/ingredients/guides?${qs}` : "/ingredients/guides");
  };

  const totalPages = Math.max(
    1,
    Math.ceil(data.count / INGREDIENT_GUIDES_PAGE_SIZE),
  );
  const showHotSection = initialSearch.trim() === "";

  return (
    <div className="flex w-full flex-col pb-6">
      <form onSubmit={handleSubmit} className="px-4 pt-3 pb-2">
        <div className="relative">
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="성분, 제품명으로 검색해보세요!"
            aria-label="성분 검색"
            enterKeyHint="search"
            className="h-11 w-full rounded-full border-0 bg-gray50 pr-12 pl-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon-lg"
            aria-label="검색"
            className="absolute top-1/2 right-1 -translate-y-1/2"
          >
            <Icon icon="IC_Search" size="lg" />
          </Button>
        </div>
      </form>

      {showHotSection && (
        <section className="px-4 pt-4">
          <h2 className="mb-1 text-base font-bold">요즘 뜨는 성분 🔥</h2>
          <ul>
            {HOT_INGREDIENTS.map((g) => (
              <IngredientRow key={`hot-${g.id}`} id={g.id} name={g.name} />
            ))}
          </ul>
        </section>
      )}

      <section className="px-4 pt-6">
        <h2 className="mb-1 text-base font-bold">성분 리스트</h2>
        {data.results.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul>
            {data.results.map((g) => (
              <IngredientRow key={g.id} id={g.id} name={g.name} />
            ))}
          </ul>
        )}

        {data.count > INGREDIENT_GUIDES_PAGE_SIZE && (
          <Pagination
            page={page}
            totalPages={totalPages}
            search={initialSearch}
            hasPrev={Boolean(data.previous)}
            hasNext={Boolean(data.next)}
          />
        )}
      </section>
    </div>
  );
}

function IngredientRow({ id, name }: { id: number; name: string }) {
  return (
    <li>
      <Link
        href={`/ingredients/guides/${id}`}
        className="flex items-center justify-between px-1 py-3 text-sm"
      >
        <span className="line-clamp-1">{name}</span>
        <Icon
          icon="IC_ArrowRight"
          size="md"
          className="text-muted-foreground"
        />
      </Link>
    </li>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  search: string;
  hasPrev: boolean;
  hasNext: boolean;
}

function buildHref(targetPage: number, search: string) {
  const params = new URLSearchParams();
  const trimmed = search.trim();
  if (trimmed) params.set("search", trimmed);
  if (targetPage > 1) params.set("page", String(targetPage));
  const qs = params.toString();
  return qs ? `/ingredients/guides?${qs}` : "/ingredients/guides";
}

function Pagination({
  page,
  totalPages,
  search,
  hasPrev,
  hasNext,
}: PaginationProps) {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i,
  );

  return (
    <nav
      aria-label="페이지네이션"
      className="mt-6 flex items-center justify-center gap-1"
    >
      <PageLink
        href={buildHref(page - 1, search)}
        disabled={!hasPrev}
        ariaLabel="이전 페이지"
      >
        <Icon icon="IC_ArrowLeft" size="sm" />
      </PageLink>
      {visiblePages.map((p) => (
        <PageLink
          key={p}
          href={buildHref(p, search)}
          active={p === page}
          ariaLabel={`${p} 페이지`}
        >
          {p}
        </PageLink>
      ))}
      <PageLink
        href={buildHref(page + 1, search)}
        disabled={!hasNext}
        ariaLabel="다음 페이지"
      >
        <Icon icon="IC_ArrowRight" size="sm" />
      </PageLink>
    </nav>
  );
}

interface PageLinkProps {
  href: string;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

function PageLink({ href, active, disabled, ariaLabel, children }: PageLinkProps) {
  const className = cn(
    "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm",
    active && "bg-foreground text-background font-semibold",
    disabled && "pointer-events-none text-muted-foreground/40",
    !active && !disabled && "text-muted-foreground hover:bg-accent",
  );
  if (disabled) {
    return (
      <span aria-disabled className={className}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}
