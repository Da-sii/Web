"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Product, SearchProduct } from "@/types/models";
import Icon from "@/components/commons/Icon/Icon";
import { ProductListRow } from "@/components/commons/ProductListRow";
import { Button } from "@/components/ui/button";

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
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="성분, 제품명으로 검색해보세요"
            aria-label="검색어"
            autoFocus
            enterKeyHint="search"
            className="h-11 w-full rounded-full border-0 bg-gray50 pr-20 pl-4 text-sm outline-none placeholder:text-gray300 focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          {word && (
            <button
              type="button"
              onClick={() => setWord("")}
              aria-label="검색어 지우기"
              className="absolute top-1/2 right-11 -translate-y-1/2 flex size-5 items-center justify-center rounded-full bg-gray300"
            >
              <X className="size-3 text-gray50" />
            </button>
          )}
          <Button
            type="submit"
            variant="ghost"
            size="icon-lg"
            aria-label="검색"
            className="absolute top-1/2 right-1 -translate-y-1/2 text-gray300"
          >
            <Icon icon="IC_Search" size="lg" />
          </Button>
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
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClearAll}
            className="px-0 text-xs text-gray500 hover:text-foreground"
          >
            전체삭제
          </Button>
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
              <div className="inline-flex items-center gap-1.5 rounded-full py-1.5 pr-1 pl-3 text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onTagClick(text)}
                  className="line-clamp-1 h-auto max-w-[160px] justify-start px-0 text-sm font-normal"
                >
                  {text}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRemove(text)}
                  aria-label={`${text} 삭제`}
                  className="size-5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </Button>
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
    <ul className="flex flex-col divide-y divide-gray100">
      {products.map((p) => (
        <li key={p.id}>
          <ProductListRow product={p as unknown as Product} />
        </li>
      ))}
    </ul>
  );
}
