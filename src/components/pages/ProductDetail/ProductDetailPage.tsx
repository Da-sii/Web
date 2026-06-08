"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductDetail } from "@/types/models";
import { ProductHero } from "./ProductHero";
import { IngredientTab } from "./IngredientTab";
import { ReviewTabPlaceholder } from "./ReviewTabPlaceholder";
import { CoupangFooter } from "./CoupangFooter";

interface ProductDetailPageProps {
  product: ProductDetail;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  return (
    <div className="flex w-full flex-col">
      <ProductHero product={product} />

      <Tabs defaultValue="ingredient" className="w-full gap-0">
        <TabsList
          variant="line"
          className="grid h-12 w-full grid-cols-2 rounded-none border-b border-gray100 bg-background p-0"
        >
          <TabsTrigger
            value="ingredient"
            className="group h-full rounded-none text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
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
            className="group h-full rounded-none text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
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

        <TabsContent value="ingredient" className="m-0">
          <IngredientTab product={product} />
        </TabsContent>
        <TabsContent value="review" className="m-0">
          <ReviewTabPlaceholder />
        </TabsContent>
      </Tabs>

      <CoupangFooter url={product.coupang} />
    </div>
  );
}
