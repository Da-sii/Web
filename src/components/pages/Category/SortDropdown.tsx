"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/types/models";

const SORT_OPTIONS: { id: ProductSort; label: string }[] = [
  { id: "monthly_rank", label: "랭킹순" },
  { id: "review_desc", label: "리뷰순" },
];

interface SortDropdownProps {
  value: ProductSort;
  onChange: (next: ProductSort) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.id === value) ?? SORT_OPTIONS[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span>{current.label}</span>
          <ChevronDown className="size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-32 p-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              onChange(opt.id);
              setOpen(false);
            }}
            className={cn(
              "w-full rounded-md px-3 py-2 text-left text-sm",
              opt.id === value
                ? "font-semibold text-green600"
                : "text-foreground hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
