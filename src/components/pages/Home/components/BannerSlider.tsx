"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { PendingLink } from "@/components/commons/NavProgress";
import type { Banner } from "@/types/models";

const BANNER_AUTO_INTERVAL_MS = 3000;
const TRANSITION_MS = 450;
const MAIN_WIDTH_RATIO = 0.78;
const SIDE_SCALE = 0.88;
const BANNER_GAP_PX = 4;

interface BannerSliderProps {
  banners: Banner[];
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const total = banners.length;
  const loop = total > 1;
  const items = loop ? [banners[total - 1], ...banners, banners[0]] : banners;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const pausedRef = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (el) setContainerWidth(el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!loop) return;
    if (index !== total && index !== -1) return;

    const targetIndex = index === total ? 0 : total - 1;
    let raf1 = 0;
    let raf2 = 0;
    const t = window.setTimeout(() => {
      // 1) transition 먼저 끄고 한 프레임 paint
      setWithTransition(false);
      raf1 = window.requestAnimationFrame(() => {
        // 2) transform(=index) 점프
        setIndex(targetIndex);
        raf2 = window.requestAnimationFrame(() => {
          // 3) 다음 프레임에 transition 복구
          setWithTransition(true);
        });
      });
    }, TRANSITION_MS);

    return () => {
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [index, total, loop]);

  const advance = useCallback(() => {
    setWithTransition(true);
    setIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    if (!loop) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) advance();
    }, BANNER_AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [loop, advance]);

  if (total === 0) return null;

  const itemWidth = containerWidth * MAIN_WIDTH_RATIO;
  const stride = itemWidth + BANNER_GAP_PX;
  const centerOffset = (containerWidth - itemWidth) / 2;
  const displayIndex = loop ? index + 1 : index;
  const translateX = containerWidth > 0
    ? centerOffset - displayIndex * stride
    : 0;

  const realIndex = ((index % total) + total) % total;
  const displayNumber = realIndex + 1;

  return (
    <section className="relative mb-5">
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div
          className="flex"
          style={{
            gap: `${BANNER_GAP_PX}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: withTransition
              ? `transform ${TRANSITION_MS}ms ease-out`
              : "none",
          }}
        >
          {items.map((banner, i) => {
            const isFocused = i === displayIndex;
            const logicalPosition = loop ? i - 1 : i;
            return (
              <PendingLink
                key={`${banner.id}-${i}`}
                href={`/banners/${banner.order}`}
                aria-current={isFocused ? "true" : undefined}
                onClick={(e) => {
                  if (!isFocused) {
                    e.preventDefault();
                    setWithTransition(true);
                    setIndex(logicalPosition);
                  }
                }}
                className="relative block aspect-square shrink-0 overflow-hidden rounded-2xl bg-muted transition-transform duration-300"
                style={{
                  width: containerWidth > 0 ? `${itemWidth}px` : "0px",
                  transform: isFocused ? "scale(1)" : `scale(${SIDE_SCALE})`,
                }}
              >
                <Image
                  src={banner.imageUrl}
                  alt={`배너 ${banner.order}`}
                  fill
                  sizes="(max-width: 768px) 78vw, 520px"
                  className="object-cover"
                  priority={i === 0}
                />
                {isFocused && (
                  <span
                    className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white"
                    aria-label={`현재 ${displayNumber}번째 배너, 총 ${total}개`}
                  >
                    {displayNumber}/{total}
                  </span>
                )}
              </PendingLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
