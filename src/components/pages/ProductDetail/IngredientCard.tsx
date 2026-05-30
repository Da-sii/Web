"use client";

import Link from "next/link";
import Icon from "@/components/commons/Icon/Icon";
import { cn } from "@/lib/utils";
import {
  computeStatus,
  formatNumber,
  type IngredientStatus,
} from "@/lib/format";
import type { ProductIngredient } from "@/types/models";
import { IngredientDonut } from "./IngredientDonut";
import { IngredientEffectsAccordion } from "./IngredientEffectsAccordion";
import { GuideUnavailableDialog } from "./GuideUnavailableDialog";

const STATUS_BG: Record<IngredientStatus, string> = {
  초과: "bg-[#FF3A4A]",
  미만: "bg-[#FFA600]",
  적정: "bg-green600",
};

function StatusTag({ status }: { status: IngredientStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white",
        STATUS_BG[status],
      )}
    >
      {status}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500">
      {children}
    </span>
  );
}

interface IngredientCardProps {
  ingredient: ProductIngredient;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const status = computeStatus(
    ingredient.amount,
    ingredient.minRecommended,
    ingredient.maxRecommended,
  );

  const titleContent = (
    <span className="flex items-center gap-1 text-sm font-bold">
      <span>{ingredient.ingredientName}</span>
      <Icon icon="IC_ArrowRight" size="sm" className="text-gray-400" />
    </span>
  );

  return (
    <div className="flex flex-col rounded-2xl bg-[#F6F5FA] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col gap-2">
          {ingredient.guideId ? (
            <Link
              href={`/ingredients/guides/${ingredient.guideId}?from=product`}
              className="self-start"
            >
              {titleContent}
            </Link>
          ) : (
            <GuideUnavailableDialog
              trigger={
                <button type="button" className="cursor-pointer self-start">
                  {titleContent}
                </button>
              }
            />
          )}

          {ingredient.mainIngredient && (
            <p className="text-xs text-muted-foreground">
              (주성분 : {ingredient.mainIngredient})
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Pill>포함량</Pill>
            <span className="font-semibold">
              {formatNumber(ingredient.amount)}
            </span>
            <StatusTag status={status} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Pill>적정 섭취량</Pill>
            <span className="font-semibold">
              {formatNumber(ingredient.minRecommended)}~
              {formatNumber(ingredient.maxRecommended)}
            </span>
          </div>
        </div>

        <div className="flex w-[88px] flex-col items-center gap-1">
          <span className="flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] text-gray-500">
            주성분 포함량
            <span aria-hidden>▾</span>
          </span>
          <IngredientDonut
            amount={ingredient.amount}
            maxRecommended={ingredient.maxRecommended}
            status={status}
          />
        </div>
      </div>

      <IngredientEffectsAccordion
        effects={ingredient.effect ?? []}
        sideEffects={ingredient.sideEffect ?? []}
      />
    </div>
  );
}
