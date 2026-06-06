"use client";

import { Info } from "lucide-react";
import type { ProductDetail } from "@/types/models";
import { IngredientCard } from "./IngredientCard";
import { IngredientEffectsAccordion } from "./IngredientEffectsAccordion";
import { OtherIngredientsSection } from "./OtherIngredientsSection";
import { InfoDialog } from "./InfoDialog";

interface IngredientTabProps {
  product: ProductDetail;
}

export function IngredientTab({ product }: IngredientTabProps) {
  const hasFunctional = product.ingredients && product.ingredients.length > 0;
  const hasOther = product.otherIngredients && product.otherIngredients.length > 0;

  return (
    <div className="flex flex-col gap-8 px-5 py-6">
      {hasFunctional && (
        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-2">
            <h2 className="text-sm font-bold">기능성 원료</h2>
            <span className="text-sm font-semibold text-green600">
              {product.ingredients.length}개
            </span>
            <InfoDialog
              kind="functional"
              trigger={
                <button
                  type="button"
                  aria-label="성분 정보 출처 안내"
                  className="ml-auto cursor-pointer"
                >
                  <Info className="size-4 text-gray-400" />
                </button>
              }
            />
          </header>

          <div className="flex flex-col gap-3">
            {product.ingredients.map((ing, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <IngredientCard ingredient={ing} />
                <div className="rounded-2xl bg-[#F6F5FA] px-4 py-4">
                  <IngredientEffectsAccordion
                    effects={ing.effect ?? []}
                    sideEffects={ing.sideEffect ?? []}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasOther && <OtherIngredientsSection items={product.otherIngredients} />}
    </div>
  );
}
