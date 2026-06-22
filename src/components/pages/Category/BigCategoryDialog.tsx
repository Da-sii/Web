"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ICategory } from "@/types/models";

interface BigCategoryDialogProps {
  categories: ICategory[];
  current: string;
  onSelect: (next: string) => void;
}

export function BigCategoryDialog({
  categories,
  current,
  onSelect,
}: BigCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-base font-bold"
        >
          <span>{current}</span>
          <ChevronDown className="size-4 text-gray-400" />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl p-0 sm:max-w-xs"
      >
        <DialogTitle className="border-b border-gray100 px-5 py-4 text-sm font-bold">
          카테고리 선택
        </DialogTitle>
        <ul className="flex max-h-[60vh] flex-col overflow-y-auto py-2">
          {categories.map((c) => {
            const isActive = c.category === current;
            return (
              <li key={c.category}>
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={() => onSelect(c.category)}
                    className={cn(
                      "w-full px-5 py-3 text-left text-sm",
                      isActive
                        ? "font-bold text-green600"
                        : "text-foreground",
                    )}
                  >
                    {c.category}
                  </button>
                </DialogClose>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
