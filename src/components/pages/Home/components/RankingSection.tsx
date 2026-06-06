"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { RankingProduct } from "@/types/models";
import Icon from "@/components/commons/Icon/Icon";
import { RankingCard } from "./RankingCard";

const MAX_ITEMS = 10;
const DRAG_THRESHOLD_PX = 5;

interface RankingSectionProps {
  products: RankingProduct[];
  title?: string;
  href?: string;
}

export function RankingSection({
  products,
  title = "월간 랭킹",
  href = "/ranking?period=monthly",
}: RankingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  // 수직 휠을 가로 스크롤로 변환
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // 사용자가 명시적으로 가로 스크롤(트랙패드 등)을 하면 그대로 둠
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const items = products.slice(0, MAX_ITEMS);
  if (items.length === 0) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    // 마우스 좌클릭 / 터치 / 펜만 처리
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const state = dragStateRef.current;
    if (!el || !state.isDown) return;

    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD_PX) {
      state.moved = true;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // 일부 환경에서 캡처 실패 — 그대로 진행
      }
    }
    if (state.moved) {
      e.preventDefault();
      el.scrollLeft = state.startScrollLeft - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    const state = dragStateRef.current;
    if (state.moved && el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    state.isDown = false;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    // 드래그로 스크롤한 경우 카드 클릭이 페이지 이동으로 이어지지 않도록 차단
    if (dragStateRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragStateRef.current.moved = false;
    }
  };

  return (
    <section className="flex flex-col gap-3 mt-2 mb-[30px]">
      <Link
        href={href}
        className="flex items-center justify-between px-6"
      >
        <h2 className="text-lg font-extrabold">{title}</h2>
        <Icon icon="IC_ArrowRight" size="lg" className="text-muted-foreground" />
      </Link>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        className="no-scrollbar cursor-grab touch-pan-y overflow-x-auto px-6 active:cursor-grabbing"
      >
        <div className="flex w-max gap-2">
          {items.map((product, index) => (
            <RankingCard
              key={product.id}
              product={product}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
