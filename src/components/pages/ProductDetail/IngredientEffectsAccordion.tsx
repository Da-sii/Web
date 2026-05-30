"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/commons/Icon/Icon";

interface IngredientEffectsAccordionProps {
  effects: string[];
  sideEffects: string[];
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">정보 없음</p>;
  }
  return (
    <ul className="flex flex-col gap-1 text-xs leading-5">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-2">
          <span
            aria-hidden
            className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground"
          />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function IngredientEffectsAccordion({
  effects,
  sideEffects,
}: IngredientEffectsAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="flex items-center justify-center gap-1 self-center px-2 py-1 text-xs text-gray-500"
      >
        <span>효과 및 부작용 알아보기</span>
        <Icon
          icon="IC_ArrowBottom"
          size="xs"
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-3 rounded-xl bg-white px-3 py-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-green600">효과</p>
            <BulletList items={effects} />
          </div>
          <div className="border-t border-dashed border-gray-200" />
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-[#FF3A4A]">부작용</p>
            <BulletList items={sideEffects} />
          </div>
        </div>
      )}
    </div>
  );
}
