import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/models";

interface ProductListRowProps {
  product: Product;
  leftBadge?: React.ReactNode;
}

export function ProductListRow({ product, leftBadge }: ProductListRowProps) {
  const avg = product.reviewAvg;
  const count = product.reviewCount;
  const hasRating = avg !== null && Number.isFinite(avg);

  return (
    <Link href={`/products/${product.id}`} className="flex gap-3 px-4 py-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray100 bg-gray-box">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-1 text-center text-xs text-gray400">
            상품 이미지를 준비중입니다
          </div>
        )}
        {leftBadge && (
          <div
            data-testid="left-badge"
            className="absolute left-0 top-0"
          >
            {leftBadge}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <span className="line-clamp-1 text-xs text-gray300">{product.company}</span>
        <span className="line-clamp-1 text-sm font-bold text-gray900">{product.name}</span>
        <div className="flex items-center gap-1 text-xs">
          {hasRating ? (
            <>
              <span className="text-yellow-star">★</span>
              <span className="text-gray500">{Number(avg).toFixed(2)}</span>
              <span className="text-gray400">({count})</span>
            </>
          ) : (
            <span className="text-gray400">리뷰 없음</span>
          )}
        </div>
      </div>
    </Link>
  );
}
