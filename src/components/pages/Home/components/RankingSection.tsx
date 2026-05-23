import Link from "next/link";
import type { RankingProduct } from "@/types/models";
import Icon from "@/components/commons/Icon/Icon";
import { RankingCard } from "./RankingCard";

const MAX_ITEMS = 10;

interface RankingSectionProps {
  products: RankingProduct[];
  title?: string;
  href?: string;
}

export function RankingSection({
  products,
  title = "월간 랭킹",
  href = "/products?period=monthly",
}: RankingSectionProps) {
  const items = products.slice(0, MAX_ITEMS);
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 py-4">
      <Link
        href={href}
        className="flex items-center justify-between px-4"
      >
        <h2 className="text-base font-bold">{title}</h2>
        <Icon icon="IC_ArrowRight" size="lg" className="text-muted-foreground" />
      </Link>
      <div className="no-scrollbar overflow-x-auto px-4">
        <div className="flex w-max gap-3">
          {items.map((product, index) => (
            <RankingCard
              key={product.id}
              product={product}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
