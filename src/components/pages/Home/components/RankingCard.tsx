import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/models";
import { Placeholder } from "@/components/commons/Placeholder/Placeholder";

interface RankingCardProps {
  product: Product;
}

export function RankingCard({ product }: RankingCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col gap-2 w-32"
    >
      <div className="relative">
        <Placeholder
          label={product.name}
          className="aspect-square w-full rounded-lg"
        />
        <span className="absolute top-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white">
          {product.rank}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground line-clamp-1">
          {product.companyName}
        </span>
        <span className="text-sm font-semibold line-clamp-2">
          {product.name}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-yellow-400 stroke-yellow-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount.toLocaleString()})</span>
        </div>
      </div>
    </Link>
  );
}
