"use client";

import type { MouseEvent, ReactNode } from "react";
import { ANDROID_STORE_URL, resolveStoreUrl } from "@/lib/app-store";
import { ReviewPhotoMosaic } from "./ReviewPhotoMosaic";

/**
 * 리뷰 사진은 웹에서 열지 않고 모자이크로만 자리를 표시한 뒤 앱 설치로 보낸다.
 * 자세한 배경은 ReviewPhotoMosaic 참고.
 *
 * 사진이 실제로 있는 리뷰에만 쓴다 — 호출부에서 seeds가 비면 아무것도 그리지 않으므로
 * 사진 없는 리뷰에 가짜 사진이 생기지는 않는다.
 */

/**
 * 스토어로 보내는 링크.
 *
 * href 는 서버에서도 정해지는 Play 스토어로 두고(자바스크립트가 없거나 새 탭으로
 * 열어도 동작한다), 실제 클릭 때 기기에 맞는 링크로 바꿔 연다.
 * UA는 서버에서 알 수 없으므로 렌더 중에 고르면 하이드레이션이 어긋난다.
 */
function StoreLink({
  className,
  ariaLabel,
  children,
}: {
  className: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.open(resolveStoreUrl(), "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href={ANDROID_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

interface LockedReviewPhotoGridProps {
  /** 미리보기로 그릴 사진들의 키. */
  seeds: string[];
}

/** 리뷰 탭 상단의 사진 모아보기 그리드. 현재 ReviewTab 에서는 쓰지 않는다. */
export function LockedReviewPhotoGrid({ seeds }: LockedReviewPhotoGridProps) {
  if (seeds.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="grid grid-cols-3 gap-1">
        {seeds.map((seed, idx) => (
          <div
            key={`${seed}-${idx}`}
            className="relative aspect-square overflow-hidden rounded-lg bg-gray50"
          >
            <ReviewPhotoMosaic seed={seed} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface LockedReviewPhotoStripProps {
  /** 이 리뷰에 달린 사진들의 키. */
  seeds: string[];
}

/** 리뷰 한 건에 딸린 썸네일 줄. 탭하면 스토어로 보낸다. */
export function LockedReviewPhotoStrip({ seeds }: LockedReviewPhotoStripProps) {
  if (seeds.length === 0) return null;

  return (
    <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
      {seeds.map((seed, idx) => (
        <StoreLink
          key={`${seed}-${idx}`}
          ariaLabel={`리뷰 사진 ${idx + 1} — 앱에서 보기`}
          className="relative block size-[100px] shrink-0 overflow-hidden rounded-xl bg-gray50"
        >
          <ReviewPhotoMosaic seed={seed} />
        </StoreLink>
      ))}
    </div>
  );
}
