"use client";

import { useState } from "react";
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
          className="grid h-12 w-full grid-cols-2 rounded-none border-b border-gray100 bg-background p-0"
        >
          <TabsTrigger
            value="ingredient"
            className="group h-full rounded-none text-sm font-semibold text-muted-foreground after:hidden data-[state=active]:text-foreground"
          >
            성분 정보
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-px left-1/2 h-0.5 -translate-x-1/2 overflow-hidden whitespace-nowrap bg-foreground text-sm font-semibold leading-none text-transparent opacity-0 transition-opacity group-data-[state=active]:opacity-100"
            >
              성분 정보
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="group h-full rounded-none text-sm font-semibold text-muted-foreground after:hidden data-[state=active]:text-foreground"
          >
            리뷰
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-px left-1/2 h-0.5 -translate-x-1/2 overflow-hidden whitespace-nowrap bg-foreground text-sm font-semibold leading-none text-transparent opacity-0 transition-opacity group-data-[state=active]:opacity-100"
            >
              리뷰
            </span>
          </TabsTrigger>
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
