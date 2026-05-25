"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ScrollAreaProps {
  children: React.ReactNode;
}

export function ScrollArea({ children }: ScrollAreaProps) {
  const pathname = usePathname();
  const showScrollbar = pathname?.startsWith("/terms/") ?? false;

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto",
        showScrollbar ? "custom-scrollbar" : "no-scrollbar",
      )}
    >
      {children}
    </div>
  );
}
