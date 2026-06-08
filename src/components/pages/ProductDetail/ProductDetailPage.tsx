"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/types/models";
import { ProductHero } from "./ProductHero";
import { IngredientTab } from "./IngredientTab";
import { ReviewTabPlaceholder } from "./ReviewTabPlaceholder";
import { CoupangFooter } from "./CoupangFooter";

interface ProductDetailPageProps {
  product: ProductDetail;
}

type TabValue = "ingredient" | "review";

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const [active, setActive] = useState<TabValue>("ingredient");
  const triggerRefs = useRef<Partial<Record<TabValue, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const trigger = triggerRefs.current[active];
    if (!trigger) return;
    const list = trigger.closest('[data-slot="tabs-list"]') as HTMLElement | null;
    const textSpan = trigger.querySelector('[aria-hidden="true"]') as HTMLElement | null;
    if (!list || !textSpan) return;
    const listRect = list.getBoundingClientRect();
    const spanRect = textSpan.getBoundingClientRect();
    setIndicator({ left: spanRect.left - listRect.left, width: spanRect.width });
  }, [active]);

  return (
    <div className="flex w-full flex-col">
      <ProductHero product={product} />

      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as TabValue)}
        className="w-full gap-0"
      >
        <TabsList
          variant="line"
          className="relative grid h-16 w-full grid-cols-2 rounded-none border-b border-gray100 bg-background p-0"
        >
          <TabsTrigger
            value="ingredient"
            ref={(el) => { triggerRefs.current.ingredient = el; }}
            className="h-full rounded-none text-sm font-semibold text-muted-foreground after:hidden data-[state=active]:text-foreground"
          >
            성분 정보
            <span
              aria-hidden
              className="pointer-events-none invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold"
            >
              성분 정보
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="review"
            ref={(el) => { triggerRefs.current.review = el; }}
            className="h-full rounded-none text-sm font-semibold text-muted-foreground after:hidden data-[state=active]:text-foreground"
          >
            리뷰
            <span
              aria-hidden
              className="pointer-events-none invisible absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold"
            >
              리뷰
            </span>
          </TabsTrigger>

          {/* 단일 슬라이딩 indicator */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-px h-0.5 bg-foreground transition-[left,width] duration-300 ease-in-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </TabsList>

        <div className="overflow-hidden">
          <div
            className={cn(
              "flex w-[200%] transition-transform duration-300 ease-in-out",
              active === "ingredient" ? "translate-x-0" : "-translate-x-1/2"
            )}
          >
            <TabsContent value="ingredient" forceMount className="m-0 w-1/2">
              <IngredientTab product={product} />
            </TabsContent>
            <TabsContent value="review" forceMount className="m-0 w-1/2">
              <ReviewTabPlaceholder />
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <CoupangFooter url={product.coupang} />
    </div>
  );
}
