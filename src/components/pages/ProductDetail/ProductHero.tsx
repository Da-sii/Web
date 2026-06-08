import Image from "next/image";
import { Star } from "lucide-react";
import type { ProductDetail, ProductImage } from "@/types/models";

type RawImage = ProductImage | string | null | undefined;

function getImageUrl(img: RawImage): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
}

interface ProductHeroProps {
  product: ProductDetail;
}

export function ProductHero({ product }: ProductHeroProps) {
  const heroUrl = getImageUrl(product.images?.[0] as RawImage);
  const avg = product.reviewAvg ?? 0;
  const count = product.reviewCount ?? 0;

  return (
    <section className="flex w-full flex-col">
      <div className="relative h-[46vh] w-full bg-background">
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={product.name}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border border-gray100 text-sm text-gray-500">
            상품 이미지를 준비중입니다.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 border-b border-gray100 px-5 py-4">
        <span className="text-xs font-bold text-muted-foreground">
          {product.company}
        </span>
        <h1 className="text-lg font-bold leading-tight">{product.name}</h1>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-yellow-400 stroke-yellow-400" />
          <span className="text-foreground">{avg.toFixed(2)}</span>
          <span>({count.toLocaleString()})</span>
        </div>
      </div>

      <div className="grid grid-cols-[20%_1fr] gap-y-2 border-b border-gray100 px-5 py-4 text-xs">
        {product.ranking && product.ranking.length > 0 && (
          <>
            <span className="text-muted-foreground">랭킹</span>
            <div className="flex flex-col gap-1">
              {product.ranking.map((r, idx) => (
                <span key={idx}>
                  {r.bigCategory} / {r.smallCategory} {r.monthlyRank}위
                </span>
              ))}
            </div>
          </>
        )}
        <span className="text-muted-foreground">식품 유형</span>
        <span>{product.productType}</span>
      </div>
    </section>
  );
}
