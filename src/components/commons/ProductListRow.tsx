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
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray100 bg-gray-box">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="96px"
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
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div className="flex flex-col gap-1.5">
          <span className="line-clamp-1 text-xs text-gray300">{product.company}</span>
          <span className="line-clamp-1 text-sm font-medium text-gray900">{product.name}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-star-yellow">★</span>
          <span className="text-gray500">{hasRating ? Number(avg).toFixed(2) : "0.00"}</span>
          <span className="text-gray400">({hasRating ? count : 0})</span>
        </div>
      </div>
    </Link>
  );
}
