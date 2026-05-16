"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategorySheet } from "@/components/commons/CategorySheet/CategorySheet";

export function BottomBar() {
  const pathname = usePathname();
  const [categoryOpen, setCategoryOpen] = useState(false);

  const isHome = pathname === "/";
  const isMypage = pathname.startsWith("/mypage");

  return (
    <>
      <nav className="sticky bottom-0 z-40 flex h-16 w-full items-center justify-around border-t bg-background">
        <button
          type="button"
          onClick={() => setCategoryOpen(true)}
          aria-label="카테고리 열기"
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs",
            categoryOpen
              ? "text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          <LayoutGrid className="size-5" />
          <span>카테고리</span>
        </button>
        <Link
          href="/"
          aria-label="홈"
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs",
            isHome
              ? "text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          <Home className="size-5" />
          <span>홈</span>
        </Link>
        <Link
          href="/mypage"
          aria-label="마이페이지"
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs",
            isMypage
              ? "text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          <User className="size-5" />
          <span>마이페이지</span>
        </Link>
      </nav>
      <CategorySheet open={categoryOpen} onOpenChange={setCategoryOpen} />
    </>
  );
}
