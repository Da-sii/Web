"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Icon from "@/components/commons/Icon/Icon";

export function BottomBar() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isCategory = pathname.startsWith("/category");
  const isMypage = pathname.startsWith("/mypage");
  const isCategory = pathname.startsWith("/category");

  if (pathname.startsWith("/inquiry")) {
    return null;
  }

  if (/^\/banners\/[^/]+$/.test(pathname)) {
    return null;
  }

  if (/^\/products\/[^/]+$/.test(pathname)) {
    return null;
  }

  return (
    <nav className="sticky bottom-0 z-40 flex h-16 w-full items-center justify-around border-t bg-background">
      <Link
        href="/category"
        aria-label="카테고리"
        className={cn(
          "flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs",
          isCategory ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        <Icon icon="IC_Category" size="lg" />
        <span>카테고리</span>
      </Link>
      <Link
        href="/"
        aria-label="홈"
        className={cn(
          "flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs",
          isHome ? "font-semibold text-foreground" : "text-muted-foreground",
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
          isMypage ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        <Icon icon="IC_Mypage" size="lg" />
        <span>마이페이지</span>
      </Link>
    </nav>
  );
}
