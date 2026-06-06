import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/models";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const avg = product.reviewAvg;
  const count = product.reviewCount;
  const hasRating = avg !== null && Number.isFinite(avg);

  return (
    <Link href={`/products/${product.id}`} className="flex flex-col gap-2 bg-white">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray100 bg-gray-box">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 480px) 50vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-gray400">
            상품 이미지를 준비중입니다
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-0.5 pb-1">
        <span className="truncate text-xs text-gray400">{product.company}</span>
        <span className="truncate text-sm font-medium text-gray900">{product.name}</span>
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
