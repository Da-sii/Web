"use client";

import { cn } from "@/lib/utils";

interface SubcategoryFilterProps {
  options: string[];
  activeOption: string;
  onSelect: (option: string) => void;
}

export function SubcategoryFilter({ options, activeOption, onSelect }: SubcategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
      {options.map((opt) => {
        const isActive = opt === activeOption;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs",
              isActive
                ? "bg-green500 text-white"
                : "border border-gray200 bg-white text-gray700",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
