import Image from "next/image";
import { PendingLink } from "@/components/commons/NavProgress";
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
    <PendingLink
      href={`/products/${product.id}`}
      className="flex w-32 flex-col gap-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray100 bg-gray-box">
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
        <span className={`absolute top-0 left-0 flex h-6 w-6 items-center justify-center rounded-br-lg text-xs font-bold text-white ${rank <= 3 ? "bg-green500" : "bg-gray400"}`}>
          {rank}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-xs text-gray400">
          {product.company}
        </span>
        <span className="truncate text-sm text-gray800">
          {product.name}
        </span>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-star-yellow">★</span>
          <span className="text-gray500">{avg.toFixed(2)}</span>
          <span className="text-gray300">({count.toLocaleString()})</span>
        </div>
      </div>
    </PendingLink>
  );
}
