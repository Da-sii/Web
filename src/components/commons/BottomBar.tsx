"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Icon from "@/components/commons/Icon/Icon";
import { Button } from "@/components/ui/button";
import { CategorySheet } from "../CategorySheet";

export function BottomBar() {
  const pathname = usePathname();
  const [categoryOpen, setCategoryOpen] = useState(false);

  const isHome = pathname === "/";
  const isMypage = pathname.startsWith("/mypage");

  if (pathname.startsWith("/inquiry")) {
    return null;
  }

  if (/^\/products\/[^/]+$/.test(pathname)) {
    return null;
  }

  return (
    <>
      <nav className="sticky bottom-0 z-40 flex h-16 w-full items-center justify-around border-t bg-background">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCategoryOpen(true)}
          aria-label="카테고리 열기"
          className={cn(
            "flex h-auto flex-col gap-1 px-4 py-2 text-xs",
            categoryOpen
              ? "text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          <Icon icon="IC_Category" size="lg" />
          <span>카테고리</span>
        </Button>
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
          <Icon icon="IC_Home" size="lg" />
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
          <Icon icon="IC_Mypage" size="lg" />
          <span>마이페이지</span>
        </Link>
      </nav>
      <CategorySheet open={categoryOpen} onOpenChange={setCategoryOpen} />
    </>
  );
}
