"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, X } from "lucide-react";
import type { SearchProduct } from "@/types/models";
import Icon from "@/components/commons/Icon/Icon";
import { Placeholder } from "@/components/commons/Placeholder";

const RECENT_KEY = "dasii.recent-searches";
const RECENT_MAX = 10;

interface SearchPageProps {
  initialWord?: string;
  results?: SearchProduct[] | null;
}

export function SearchPage({ initialWord = "", results = null }: SearchPageProps) {
  const router = useRouter();
  const [word, setWord] = useState(initialWord);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecent(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    } catch {
      // ignore corrupt localStorage
    }
  }, []);

  useEffect(() => {
    const trimmed = initialWord.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((w) => w !== trimmed)].slice(0, RECENT_MAX);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, [initialWord]);

  const navigateToSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    router.push(`/search?word=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigateToSearch(word);
  };

  const handleTagClick = (text: string) => {
    setWord(text);
    navigateToSearch(text);
  };

  const removeRecent = (text: string) => {
    setRecent((prev) => {
      const next = prev.filter((w) => w !== text);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };

  const clearAll = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      // ignore quota errors
    }
  };

  const showResults = initialWord.trim() !== "" && results !== null;

  return (
    <div className="flex w-full flex-col">
      <form onSubmit={handleSubmit} className="px-4 pt-3 pb-2">
        <div className="relative">
          <input
            type="search"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="성분, 제품명으로 검색해보세요"
            aria-label="검색어"
            autoFocus
            enterKeyHint="search"
            className="h-11 w-full rounded-full border-0 bg-gray50 pr-12 pl-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <button
            type="submit"
            aria-label="검색"
            className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center"
          >
            <Icon icon="IC_Search" size="lg" />
          </button>
        </div>
      </form>

      {showResults ? (
        <SearchResults products={results} />
      ) : (
        <RecentSearches
          recent={recent}
          onTagClick={handleTagClick}
          onRemove={removeRecent}
          onClearAll={clearAll}
        />
      )}
    </div>
  );
}

interface RecentSearchesProps {
  recent: string[];
  onTagClick: (text: string) => void;
  onRemove: (text: string) => void;
  onClearAll: () => void;
}

function RecentSearches({ recent, onTagClick, onRemove, onClearAll }: RecentSearchesProps) {
  return (
    <section className="flex flex-col gap-3 px-4 py-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">최근 검색</h2>
        {recent.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            전체삭제
          </button>
        )}
      </div>
      {recent.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          최근 검색 내역이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {recent.map((text) => (
            <li key={text}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gray50 py-1.5 pr-2 pl-3 text-sm">
                <button
                  type="button"
                  onClick={() => onTagClick(text)}
                  className="line-clamp-1 max-w-[160px] text-left"
                >
                  {text}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(text)}
                  aria-label={`${text} 삭제`}
                  className="inline-flex size-4 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SearchResults({ products }: { products: SearchProduct[] }) {
  if (products.length === 0) {
    return (
      <section className="px-4 py-10 text-center text-sm text-muted-foreground">
        검색 결과가 없습니다.
      </section>
    );
  }
  return (
    <ul className="flex flex-col">
      {products.map((p) => {
        const avg = p.reviewAvg != null ? Number(p.reviewAvg) : null;
        const count = Number(p.reviewCount);
        const hasRating = avg != null && Number.isFinite(avg) && count > 0;
        return (
          <li key={p.id}>
            <Link href={`/products/${p.id}`} className="flex gap-3 px-4 py-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <Placeholder label={p.name} className="absolute inset-0" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center gap-0.5">
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {p.company}
                </span>
                <span className="line-clamp-2 text-sm font-semibold">{p.name}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 fill-yellow-400 stroke-yellow-400" />
                  {hasRating ? (
                    <>
                      <span>{avg.toFixed(2)}</span>
                      <span>({count.toLocaleString()})</span>
                    </>
                  ) : (
                    <span>리뷰 없음</span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
