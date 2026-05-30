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
            className="h-full rounded-none border-b-2 border-transparent text-sm font-semibold text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >
            성분 정보
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="h-full rounded-none border-b-2 border-transparent text-sm font-semibold text-muted-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >
            리뷰
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
