"use client";

import { Info } from "lucide-react";
import type { OtherIngredient } from "@/types/models";
import { InfoDialog } from "./InfoDialog";
import { GuideUnavailableDialog } from "./GuideUnavailableDialog";

interface OtherIngredientsSectionProps {
  items: OtherIngredient[];
}

function getName(item: OtherIngredient | string): string {
  if (typeof item === "string") return item;
  return item?.otherIngredientName ?? "";
}

export function OtherIngredientsSection({ items }: OtherIngredientsSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-2">
        <h2 className="text-sm font-bold">기타 원료</h2>
        <span className="text-sm font-semibold text-green600">
          {items.length}개
        </span>
        <InfoDialog
          kind="other"
          trigger={
            <button
              type="button"
              aria-label="기타 원료 안내"
              className="ml-auto cursor-pointer"
            >
              <Info className="size-4 text-gray-400" />
            </button>
          }
        />
      </header>

      <div className="flex flex-col rounded-2xl bg-[#F6F5FA] px-4 py-3">
        {items.map((item, idx) => {
          const name = getName(item);
          return (
            <GuideUnavailableDialog
              key={idx}
              trigger={
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2 py-1.5 text-left text-sm"
                >
                  <span aria-hidden className="text-gray-400">
                    •
                  </span>
                  <span>{name}</span>
                </button>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
