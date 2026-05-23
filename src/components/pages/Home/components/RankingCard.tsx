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
  const avg = product.reviewAvg ?? 0;
  const count = product.reviewCount ?? 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex w-32 flex-col gap-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
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
        <span className="absolute top-1 left-1 rounded-md bg-green500 px-1.5 py-0.5 text-xs font-semibold text-white">
          {rank}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-xs text-muted-foreground">
          {product.company}
        </span>
        <span className="truncate text-sm">
          {product.name}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-yellow-400 stroke-yellow-400" />
          <span>{avg.toFixed(2)}</span>
          <span>({count.toLocaleString()})</span>
        </div>
      </div>
    </Link>
  );
}
