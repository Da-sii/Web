"use client";

import { useEffect, useState } from "react";
import type { ProductDetail, Review, ReviewStats as ReviewStatsType } from "@/types/models";
import { fetchReviews, fetchReviewStats } from "@/lib/api";
import { ReviewStats } from "./ReviewStats";
import { ReviewItem } from "./ReviewItem";
import { AppInstallBanner } from "./AppInstallBanner";

interface ReviewTabProps {
  product: ProductDetail;
}

export function ReviewTab({ product }: ReviewTabProps) {
  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviewStats(product.id)
      .then(setStats)
      .catch(() => setStats(null));
    fetchReviews(product.id, 0)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [product.id]);

  const totalReviews = stats?.totalReviews ?? product.reviewCount;

  return (
    <div className="flex flex-col gap-5 px-5 py-5">
      {/* 헤더 */}
      <div className="flex items-center gap-1">
        <span className="text-base font-bold">리뷰</span>
        <span className="text-base font-bold text-gray-400">({totalReviews})</span>
      </div>

      {totalReviews === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm font-semibold text-gray-600">아직 작성된 리뷰가 없어요.</p>
          <p className="text-sm font-semibold text-gray-600">첫번째 리뷰를 작성해주세요!</p>
        </div>
      ) : (
        <>
          {stats && <ReviewStats stats={stats} />}

          {/* 구분선 */}
          {reviews.length > 0 && (
            <div className="-mx-5 h-px bg-gray-50" />
          )}

          {/* 리뷰 목록 */}
          {reviews.length > 0 && (
            <div className="-mx-5 flex flex-col divide-y divide-gray-100">
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
        </>
      )}

      {/* 앱 설치 유도 — 리뷰가 0개인 제품에서도 노출되어야 한다 */}
      <AppInstallBanner />
    </div>
  );
}
