"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCategoryProducts } from "@/lib/api";
import type { GetProductsPayload, Product } from "@/types/models";

interface UseInfiniteProductsResult {
  products: Product[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
}

export function useInfiniteProducts(
  payload: GetProductsPayload,
): UseInfiniteProductsResult {
  const enabled = !!payload.bigCategory;
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reqIdRef = useRef(0);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  const key = JSON.stringify({
    b: payload.bigCategory ?? "",
    m: payload.middleCategory ?? "",
    s: payload.smallCategory ?? "",
    sort: payload.sort ?? "monthly_rank",
  });

  useEffect(() => {
    if (!enabled) {
      setProducts([]);
      setHasNextPage(false);
      setPage(1);
      setIsInitialLoading(false);
      return;
    }
    const id = ++reqIdRef.current;
    setIsInitialLoading(true);
    setError(null);
    setProducts([]);
    setHasNextPage(false);
    setPage(1);

    fetchCategoryProducts({ ...payloadRef.current, page: 1 })
      .then((res) => {
        if (reqIdRef.current !== id) return;
        setProducts(res.results);
        setHasNextPage(res.next !== null);
        setPage(1);
      })
      .catch((e: unknown) => {
        if (reqIdRef.current !== id) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (reqIdRef.current === id) setIsInitialLoading(false);
      });
  }, [key, enabled]);

  const fetchNextPage = useCallback(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage || isInitialLoading) return;
    const nextPage = page + 1;
    const id = reqIdRef.current;
    setIsFetchingNextPage(true);
    fetchCategoryProducts({ ...payloadRef.current, page: nextPage })
      .then((res) => {
        if (reqIdRef.current !== id) return;
        setProducts((prev) => [...prev, ...res.results]);
        setHasNextPage(res.next !== null);
        setPage(nextPage);
      })
      .catch((e: unknown) => {
        if (reqIdRef.current !== id) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (reqIdRef.current === id) setIsFetchingNextPage(false);
      });
  }, [enabled, hasNextPage, isFetchingNextPage, isInitialLoading, page]);

  return {
    products,
    fetchNextPage,
    hasNextPage,
    isInitialLoading,
    isFetchingNextPage,
    error,
  };
}
