"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CoupangFooterProps {
  url: string;
}

function normalizeUrl(raw: string): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function CoupangFooter({ url }: CoupangFooterProps) {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return null;

  return (
    <footer className="sticky bottom-0 z-30 flex items-center gap-3 border-t border-gray100 bg-background px-4 py-3">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="쿠팡 파트너스 안내"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-400"
          >
            <Info className="size-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="text-xs leading-5">
          쿠팡 파트너스 링크를 통해 미판매 제품을 구매할 수 있어요. (구매 시 다시가
          일정액 수수료를 받아요)
        </PopoverContent>
      </Popover>

      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 flex-1 items-center justify-center rounded-xl bg-green600 text-sm font-bold text-white"
      >
        최저가 보러가기
      </a>
    </footer>
  );
}
