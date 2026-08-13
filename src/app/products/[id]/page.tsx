import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductDetail } from "@/lib/api";
import { ProductDetailPage } from "@/components/pages/ProductDetail/ProductDetailPage";
import { JsonLd } from "@/components/commons/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site";
import type { ProductDetail } from "@/types/models";

type Params = Promise<{ id: string }>;

function parseProductId(id: string): number | null {
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildDescription(product: ProductDetail): string {
  const parts = [product.company, product.name].filter(Boolean);
  const ingredients = product.ingredientsCount
    ? `주요 성분 ${product.ingredientsCount}종의 함량과 적정 섭취량`
    : "성분 정보";
  const reviews = product.reviewCount
    ? `실제 후기 ${product.reviewCount.toLocaleString("ko-KR")}건`
    : "실제 사용자 후기";
  return `${parts.join(" ")} — ${ingredients}, ${reviews}을 다시에서 확인하세요.`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseProductId(id);
  if (parsedId === null) {
    return { title: "제품" };
  }

  // 아래 Page 와 같은 fetch 라 Next 의 요청 단위 캐시로 중복 호출되지 않는다.
  const product = await fetchProductDetail(parsedId).catch(() => null);
  if (!product) {
    return { title: "제품" };
  }

  const canonical = absoluteUrl(`/products/${product.id}`);
  const description = buildDescription(product);
  const image = product.images?.[0]?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      siteName: "다시",
      locale: "ko_KR",
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const parsedId = parseProductId(id);
  if (parsedId === null) {
    notFound();
  }
  const product = await fetchProductDetail(parsedId);
  if (!product) {
    notFound();
  }

  const topRanking = product.ranking?.[0];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          ...(topRanking?.bigCategory
            ? [
                {
                  name: topRanking.bigCategory,
                  path: `/category/list?main=${encodeURIComponent(topRanking.bigCategory)}`,
                },
              ]
            : []),
          { name: product.name, path: `/products/${product.id}` },
        ])}
      />
      <ProductDetailPage product={product} />
    </>
  );
}
