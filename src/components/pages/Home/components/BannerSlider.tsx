"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types/models";

const BANNER_AUTO_INTERVAL_MS = 5000;
const BANNER_WIDTH_RATIO = 0.85;
const BANNER_GAP_PX = 12;

interface BannerSliderProps {
  banners: Banner[];
}

function getItemStride(el: HTMLDivElement) {
  return el.clientWidth * BANNER_WIDTH_RATIO + BANNER_GAP_PX;
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = banners.length;

  const scrollToNext = useCallback(() => {
    const el = containerRef.current;
    if (!el || total <= 1) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % total;
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: next * getItemStride(el), behavior: "smooth" });
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
    if (total <= 1) return;
    timerRef.current = window.setInterval(scrollToNext, BANNER_AUTO_INTERVAL_MS);
  }, [scrollToNext, total]);

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
    const index = Math.round(el.scrollLeft / getItemStride(el));
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    if (!isProgrammaticScroll.current) {
      startTimer();
    }
  };

  if (total === 0) return null;

  const sidePaddingPct = ((1 - BANNER_WIDTH_RATIO) / 2) * 100;

  return (
    <section className="relative py-2">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        style={{
          paddingLeft: `${sidePaddingPct}%`,
          paddingRight: `${sidePaddingPct}%`,
          gap: `${BANNER_GAP_PX}px`,
        }}
      >
        {banners.map((banner, index) => {
          const isFocused = index === currentIndex;
          return (
            <Link
              key={banner.id}
              href={`/banners/${banner.order}`}
              aria-current={isFocused ? "true" : undefined}
              className="relative block aspect-square flex-shrink-0 snap-center overflow-hidden rounded-2xl bg-muted transition-transform duration-300"
              style={{
                width: `${BANNER_WIDTH_RATIO * 100}%`,
                transform: isFocused ? "scale(1)" : "scale(0.94)",
              }}
            >
              <Image
                src={banner.imageUrl}
                alt={`배너 ${banner.order}`}
                fill
                sizes="(max-width: 768px) 85vw, 650px"
                className="object-cover"
                priority={index === 0}
              />
              {isFocused && (
                <span
                  className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white"
                  aria-label={`현재 ${currentIndex + 1}번째 배너, 총 ${total}개`}
                >
                  {currentIndex + 1}/{total}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
