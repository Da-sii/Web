"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types/models";

const BANNER_AUTO_INTERVAL_MS = 5000;
const BANNER_WIDTH_RATIO = 0.88;
const BANNER_GAP_PX = 0;
const SCROLL_SETTLE_FALLBACK_MS = 1200;

interface BannerSliderProps {
  banners: Banner[];
}

function getItemStride(el: HTMLDivElement) {
  // Items are `width: BANNER_WIDTH_RATIO%` inside a flex container whose content box
  // is already BANNER_WIDTH_RATIO × clientWidth (padding eats the rest).
  // CSS % on flex children resolves against the content box, so actual item width
  // = BANNER_WIDTH_RATIO² × clientWidth.
  return el.clientWidth * BANNER_WIDTH_RATIO * BANNER_WIDTH_RATIO + BANNER_GAP_PX;
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const timerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  // displayIndex: 0 = clone of last, 1..total = real items, total+1 = clone of first
  const displayIndexRef = useRef(1);
  const [displayIndex, setDisplayIndex] = useState(1);

  const total = banners.length;
  const loopEnabled = total > 1;
  // [clone_last, real_0 ... real_(N-1), clone_first]
  const displayItems = loopEnabled
    ? [banners[total - 1], ...banners, banners[0]]
    : banners;

  const setDisplay = useCallback((idx: number) => {
    displayIndexRef.current = idx;
    setDisplayIndex(idx);
  }, []);

  const clearSettleTimer = () => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  };

  // Instant jump without animation (used after clone scroll settles)
  const teleportTo = useCallback(
    (targetDisplayIdx: number) => {
      const el = containerRef.current;
      if (!el) return;
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: targetDisplayIdx * getItemStride(el), behavior: "auto" });
      setDisplay(targetDisplayIdx);
      settleTimerRef.current = window.setTimeout(() => {
        isProgrammaticScroll.current = false;
        settleTimerRef.current = null;
      }, 50);
    },
    [setDisplay],
  );

  const goTo = useCallback(
    (targetDisplayIdx: number) => {
      const el = containerRef.current;
      if (!el || total === 0) return;

      clearSettleTimer();
      isProgrammaticScroll.current = true;
      setDisplay(targetDisplayIdx);

      const needsTeleport = targetDisplayIdx === total + 1 || targetDisplayIdx === 0;
      const teleportTarget = targetDisplayIdx === total + 1 ? 1 : total;

      const onSettle = () => {
        if (needsTeleport) {
          teleportTo(teleportTarget);
        } else {
          isProgrammaticScroll.current = false;
          settleTimerRef.current = null;
        }
      };

      // scrollend fires when smooth scroll animation actually completes
      el.addEventListener("scrollend", onSettle, { once: true });

      el.scrollTo({ left: targetDisplayIdx * getItemStride(el), behavior: "smooth" });

      // Fallback: if scrollend doesn't fire (older browsers / snap override), force settle
      settleTimerRef.current = window.setTimeout(() => {
        el.removeEventListener("scrollend", onSettle);
        onSettle();
      }, SCROLL_SETTLE_FALLBACK_MS);
    },
    [setDisplay, teleportTo, total],
  );

  const advanceNext = useCallback(() => {
    if (!loopEnabled) return;
    const next = displayIndexRef.current + 1;
    // next can be total+1 (clone of first) — goTo handles teleport
    goTo(next > total + 1 ? 1 : next);
  }, [goTo, loopEnabled, total]);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (!loopEnabled) return;
    timerRef.current = window.setInterval(advanceNext, BANNER_AUTO_INTERVAL_MS);
  }, [advanceNext, loopEnabled]);

  // Set before first paint to avoid a flash at the clone position
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || !loopEnabled) return;
    el.scrollLeft = getItemStride(el);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!el || isProgrammaticScroll.current) return;

    const stride = getItemStride(el);
    const idx = Math.round(el.scrollLeft / stride);

    if (loopEnabled) {
      if (idx <= 0) {
        // User swiped back past first real item → jump to real last
        teleportTo(total);
        startTimer();
        return;
      }
      if (idx >= total + 1) {
        // User swiped forward past last real item → jump to real first
        teleportTo(1);
        startTimer();
        return;
      }
    }

    if (idx !== displayIndexRef.current) {
      setDisplay(idx);
    }
    startTimer();
  };

  if (total === 0) return null;

  const sidePaddingPct = ((1 - BANNER_WIDTH_RATIO) / 2) * 100;
  // Convert display index to logical (0-based) for badge number
  const logicalIndex = loopEnabled
    ? (displayIndex - 1 + total) % total
    : displayIndex;

  return (
    <section className="relative mb-5">
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
        {displayItems.map((banner, dIdx) => {
          const isFocused = dIdx === displayIndex;
          return (
            <Link
              key={`${banner.id}-${dIdx}`}
              href={`/banners/${banner.order}`}
              aria-current={isFocused ? "true" : undefined}
              onClick={(e) => {
                if (!isFocused) {
                  e.preventDefault();
                  // Clicking a clone navigates to the corresponding real item
                  let target = dIdx;
                  if (loopEnabled) {
                    if (dIdx === 0) target = total;
                    else if (dIdx === total + 1) target = 1;
                  }
                  goTo(target);
                }
              }}
              className="relative block aspect-square flex-shrink-0 snap-center overflow-hidden rounded-2xl bg-muted transition-transform duration-300"
              style={{
                width: `${BANNER_WIDTH_RATIO * 100}%`,
                transform: isFocused ? undefined : "scale(0.80)",
              }}
            >
              <Image
                src={banner.imageUrl}
                alt={`배너 ${banner.order}`}
                fill
                sizes="(max-width: 768px) 85vw, 650px"
                className="object-cover"
                priority={dIdx === 1}
              />
              {isFocused && (
                <span
                  className="absolute top-5 right-5 rounded-full bg-black/40 px-4 py-1 text-sm font-bold text-white"
                  aria-label={`현재 ${logicalIndex + 1}번째 배너, 총 ${total}개`}
                >
                  {logicalIndex + 1}/{total}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
