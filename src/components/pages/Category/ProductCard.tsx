import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Placeholder } from "@/components/commons/Placeholder";
import type { Product } from "@/types/models";

function parseRating(raw: string | number | null | undefined): number {
  const n = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
  return Number.isFinite(n) ? n : 0;
}

function parseCount(raw: string | number | null | undefined): number {
  const n = typeof raw === "number" ? raw : parseInt(String(raw ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
}

interface ProductCardProps {
  product: Product;
  view: "grid" | "list";
}

export function ProductCard({ product, view }: ProductCardProps) {
  const avg = parseRating(product.reviewAvg);
  const count = parseCount(product.reviewCount);

  if (view === "list") {
    return (
      <Link
        href={`/products/${product.id}`}
        className="flex w-full items-center gap-3 border-b border-gray100 px-5 py-3"
      >
        <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <Placeholder label={product.name} className="absolute inset-0" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-xs text-muted-foreground">
            {product.company}
          </span>
          <span className="line-clamp-2 text-sm">{product.name}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-yellow-400 stroke-yellow-400" />
            <span>{avg.toFixed(2)}</span>
            <span>({count.toLocaleString()})</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="flex flex-col gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 512px) 50vw, 256px"
            className="object-cover"
          />
        ) : (
          <Placeholder label={product.name} className="absolute inset-0" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-xs text-muted-foreground">
          {product.company}
        </span>
        <span className="line-clamp-2 text-sm">{product.name}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-yellow-400 stroke-yellow-400" />
          <span>{avg.toFixed(2)}</span>
          <span>({count.toLocaleString()})</span>
        </div>
      </div>
    </Link>
  );
}
