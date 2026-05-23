import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { RankingProduct } from "@/types/models";
import { Placeholder } from "@/components/commons/Placeholder";

interface RankingCardProps {
  product: RankingProduct;
  rank: number;
}

export function RankingCard({ product, rank }: RankingCardProps) {
  const hasRating = product.reviewAvg != null && product.reviewCount > 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex w-32 flex-col gap-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <Placeholder label={product.name} className="absolute inset-0" />
        )}
        <span className="absolute top-1 left-1 rounded-md bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
          {rank}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="line-clamp-1 text-xs text-muted-foreground">
          {product.company}
        </span>
        <span className="line-clamp-2 text-sm font-semibold">
          {product.name}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-yellow-400 stroke-yellow-400" />
          {hasRating ? (
            <>
              <span>{product.reviewAvg!.toFixed(2)}</span>
              <span>({product.reviewCount.toLocaleString()})</span>
            </>
          ) : (
            <span>리뷰 없음</span>
          )}
        </div>
      </div>
    </Link>
  );
}
