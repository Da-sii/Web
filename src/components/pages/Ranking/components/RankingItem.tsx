import { cn } from "@/lib/utils";
import { ProductListRow } from "@/components/commons/ProductListRow";
import type { Product, RankingProduct } from "@/types/models";

interface RankingItemProps {
  product: RankingProduct;
  rank: number;
}

function RankBadge({ rank }: { rank: number }) {
  const isTop = rank <= 3;
  return (
    <div
      data-testid="rank-badge"
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-br-lg text-xs font-bold text-white",
        isTop ? "bg-green500" : "bg-gray400",
      )}
    >
      {rank}
    </div>
  );
}

function DiffIndicator({ rankDiff }: { rankDiff: number | null }) {
  if (rankDiff === null) {
    return <span className="text-xs font-bold text-blue500">NEW</span>;
  }
  if (rankDiff === 0) {
    return <span className="text-xs text-gray400">—</span>;
  }
  if (rankDiff > 0) {
    return <span className="text-xs text-red500">▲{rankDiff}</span>;
  }
  return <span className="text-xs text-gray400">▼{Math.abs(rankDiff)}</span>;
}

export function RankingItem({ product, rank }: RankingItemProps) {
  return (
    <div className="relative flex items-center">
      <div className="flex-1">
        <ProductListRow
          product={product as unknown as Product}
          leftBadge={<RankBadge rank={rank} />}
        />
      </div>
      <div className="pr-4">
        <DiffIndicator rankDiff={product.rankDiff} />
      </div>
    </div>
  );
}
