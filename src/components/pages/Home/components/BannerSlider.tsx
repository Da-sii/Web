"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types/models";

const BANNER_AUTO_INTERVAL_MS = 5000;
const BANNER_WIDTH_RATIO = 0.85;
const BANNER_GAP_PX = 12;
const SCROLL_SETTLE_MS = 600;

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
  const settleTimerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = banners.length;
  const loopEnabled = total > 1;
  // 마지막 컨텐츠가 보이고 난 뒤 우측에 첫 컨텐츠가 이어 보이도록 첫 배너를 끝에 복제
  const displayItems = loopEnabled ? [...banners, banners[0]] : banners;

  const updateIndex = useCallback((index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
  }, []);

  const clearSettleTimer = () => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  };

  const goTo = useCallback(
    (targetIndex: number) => {
      const el = containerRef.current;
      if (!el || total === 0) return;

      clearSettleTimer();
      isProgrammaticScroll.current = true;
      updateIndex(targetIndex);
      el.scrollTo({
        left: targetIndex * getItemStride(el),
        behavior: "smooth",
      });

      if (loopEnabled && targetIndex === total) {
        // 복제된 첫 배너에 도달한 뒤 애니메이션 없이 실제 첫 배너로 텔레포트
        settleTimerRef.current = window.setTimeout(() => {
          const node = containerRef.current;
          if (node) {
            node.scrollTo({ left: 0, behavior: "auto" });
          }
          updateIndex(0);
          isProgrammaticScroll.current = false;
          settleTimerRef.current = null;
        }, SCROLL_SETTLE_MS);
      } else {
        settleTimerRef.current = window.setTimeout(() => {
          isProgrammaticScroll.current = false;
          settleTimerRef.current = null;
        }, SCROLL_SETTLE_MS);
      }
    },
    [loopEnabled, total, updateIndex],
  );

  const advanceNext = useCallback(() => {
    if (!loopEnabled) return;
    goTo(currentIndexRef.current + 1);
  }, [goTo, loopEnabled]);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    if (!loopEnabled) return;
    timerRef.current = window.setInterval(advanceNext, BANNER_AUTO_INTERVAL_MS);
  }, [advanceNext, loopEnabled]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      clearSettleTimer();
    };
  }, [startTimer]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (isProgrammaticScroll.current) return;

    const index = Math.round(el.scrollLeft / getItemStride(el));
    if (index !== currentIndexRef.current) {
      updateIndex(index);
    }
    startTimer();
  };

  if (total === 0) return null;

  const sidePaddingPct = ((1 - BANNER_WIDTH_RATIO) / 2) * 100;
  const displayNumber = (currentIndex % total) + 1;

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
        {displayItems.map((banner, index) => {
          const isFocused = index === currentIndex;
          return (
            <Link
              key={`${banner.id}-${index}`}
              href={`/banners/${banner.order}`}
              aria-current={isFocused ? "true" : undefined}
              onClick={(e) => {
                if (!isFocused) {
                  e.preventDefault();
                  goTo(index);
                }
              }}
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
                  aria-label={`현재 ${displayNumber}번째 배너, 총 ${total}개`}
                >
                  {displayNumber}/{total}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
