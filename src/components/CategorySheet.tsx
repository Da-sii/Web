"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categoryItems } from "@/lib/mock-data";

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategorySheet({ open, onOpenChange }: CategorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-3/4 max-w-xs">
        <SheetHeader>
          <SheetTitle>카테고리</SheetTitle>
        </SheetHeader>
        <nav>
          <ul className="flex flex-col">
            {categoryItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.linkUrl}
                  className="block px-4 py-3 text-sm hover:bg-accent"
                  onClick={() => onOpenChange(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
