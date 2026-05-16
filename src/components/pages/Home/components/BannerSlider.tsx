"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { banners } from "@/lib/mock-data";
import { Placeholder } from "@/components/commons/Placeholder/Placeholder";

const BANNER_AUTO_INTERVAL_MS = 4000;

export function BannerSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = banners.length;

  const scrollToNext = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % total;
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);
      return next;
    });
  }, [total]);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(scrollToNext, BANNER_AUTO_INTERVAL_MS);
  }, [scrollToNext]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTimer]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    if (!isProgrammaticScroll.current) {
      startTimer();
    }
  };

  return (
    <section className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.linkUrl}
            className="block w-full min-w-full flex-shrink-0 snap-start"
          >
            <Placeholder
              label={banner.title}
              className="aspect-[16/9] w-full"
            />
          </Link>
        ))}
      </div>
      <div
        className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
        aria-label={`현재 ${currentIndex + 1}번째 배너, 총 ${total}개`}
      >
        {currentIndex + 1}/{total}
      </div>
    </section>
  );
}
