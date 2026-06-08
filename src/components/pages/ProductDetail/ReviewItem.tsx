"use client";

import { useState } from "react";
import Image from "next/image";
import type { Review } from "@/types/models";
import { ReviewStar } from "./ReviewStar";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full px-5 py-4">
      {/* 헤더: 이름, 별점, 날짜 */}
      <div className="mb-3 flex flex-col gap-1">
        <span className="text-sm font-semibold">{review.name}</span>
        <div className="flex items-center gap-1">
          <ReviewStar rating={review.rating} size={12} />
          <span className="border-l border-gray100 pl-1 text-[11px] text-gray-400">
            {review.date}
            {review.isEdited && "  수정됨"}
          </span>
        </div>
      </div>

      {/* 본문 */}
      <p
        className={`text-[13px] leading-5 text-gray-800 ${
          !expanded ? "line-clamp-5" : ""
        }`}
      >
        {review.content}
      </p>
      {review.content.split("\n").length > 5 || review.content.length > 200 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[11px] text-gray-400"
        >
          {expanded ? "접기" : "더보기"}
        </button>
      ) : null}

      {/* 이미지 가로 스크롤 */}
      {review.images.length > 0 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
          {review.images.map((url, idx) => (
            <div
              key={idx}
              className="relative size-[100px] shrink-0 overflow-hidden rounded-xl"
            >
              <Image
                src={url}
                alt={`리뷰 이미지 ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
