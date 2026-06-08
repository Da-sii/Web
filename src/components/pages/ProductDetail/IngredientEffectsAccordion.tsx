"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
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
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray900"
      >
        <span>효과 및 부작용 알아보기</span>
        <Icon
          icon="IC_ArrowBottom"
          size="sm"
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex gap-2">
            <ThumbsUp className="mt-0.5 size-4 shrink-0 fill-green600 stroke-green600" />
            <BulletList items={effects} />
          </div>
          <div className="border-t border-dashed border-gray100" />
          <div className="flex gap-2">
            <ThumbsDown className="mt-0.5 size-4 shrink-0 fill-[#FF3A4A] stroke-[#FF3A4A]" />
            <BulletList items={sideEffects} />
          </div>
        </div>
      )}
    </div>
  );
}
