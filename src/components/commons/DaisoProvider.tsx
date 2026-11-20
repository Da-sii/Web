"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { DAISO_BIG_CATEGORY } from "@/lib/daiso";
import type { Product } from "@/types/models";
import DaisoBadge from "@/components/pages/Home/components/DaisoBadge";

export async function loadDaisoProducts(): Promise<Product[]> {
  const products = new Map<number, Product>();
  for (let page = 1; page <= 20; page++) {
    try {
      const data = await fetchProducts({ bigCategory: DAISO_BIG_CATEGORY, sort: "monthly_rank", page });
      for (const product of data.results) {
        if (!products.has(product.id)) products.set(product.id, product);
      }
      if (!data.next) break;
    } catch {
      break;
    }
  }
  return [...products.values()];
}

const Context = createContext({
  products: [] as Product[],
  ids: new Set<number>(),
  loading: true,
  ensure: () => {},
});

export function DaisoProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const updated = useRef(0);
  const pending = useRef<Promise<void> | null>(null);
  const ensure = useCallback(() => {
    if (pending.current || Date.now() - updated.current < 30 * 60 * 1000) return;
    setLoading(true);
    pending.current = loadDaisoProducts().then((items) => {
      setProducts(items);
      updated.current = Date.now();
    }).finally(() => {
      setLoading(false);
      pending.current = null;
    });
  }, []);
  const ids = useMemo(() => new Set(products.map((p) => p.id)), [products]);
  return <Context.Provider value={{ products, ids, loading, ensure }}>{children}</Context.Provider>;
}

export function useDaisoProducts() {
  const value = useContext(Context);
  const { ensure } = value;
  useEffect(() => { ensure(); }, [ensure]);
  return value;
}

export function ProductDaisoBadge({ id, size = "sm" }: { id: number; size?: "sm" | "lg" }) {
  const { ids } = useDaisoProducts();
  return ids.has(id) ? <DaisoBadge size={size} /> : null;
}
