"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronRight } from "lucide-react";
import { rankingProducts } from "@/lib/mock-data";
import { RankingCard } from "./RankingCard";

const CARD_WIDTH_PX = 128;
const CARD_GAP_PX = 12;

export function RankingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rankingProducts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CARD_WIDTH_PX + CARD_GAP_PX,
    horizontal: true,
    overscan: 3,
  });

  return (
    <section className="flex flex-col gap-3 py-4">
      <Link
        href="/products"
        className="flex items-center justify-between px-4"
      >
        <h2 className="text-base font-bold">현재 급상승 랭킹</h2>
        <ChevronRight className="size-5 text-muted-foreground" />
      </Link>
      <div
        ref={scrollRef}
        className="no-scrollbar overflow-x-auto px-4"
      >
        <div
          style={{
            width: `${virtualizer.getTotalSize()}px`,
            height: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const product = rankingProducts[virtualItem.index];
            return (
              <div
                key={product.id}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: `translateX(${virtualItem.start}px)`,
                  width: `${CARD_WIDTH_PX}px`,
                }}
              >
                <RankingCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
