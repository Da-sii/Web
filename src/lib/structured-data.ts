import { SITE_URL, absoluteUrl } from "@/lib/site";
import { SUPPORT_EMAIL } from "@/lib/app-store";
import type { ProductDetail } from "@/types/models";

const SITE_NAME = "다시";
const SITE_DESCRIPTION = "다이어트 보조제 성분 분석 및 후기 서비스";

/** Home/components/Bottom.tsx 의 사업자 정보와 동일 */
const BUSINESS = {
  legalName: "포도상점",
  address: "서울시 노원구 석계로 98-2 3층 스타트업 스테이션",
  email: "podosangjeom@gmail.com",
} as const;

export function webSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?word={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/images/logo.png"),
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      streetAddress: BUSINESS.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SUPPORT_EMAIL,
      availableLanguage: ["ko"],
    },
  };
}

export function productJsonLd(product: ProductDetail): Record<string, unknown> {
  const hasRating =
    product.reviewAvg !== null &&
    Number.isFinite(product.reviewAvg) &&
    product.reviewCount > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: absoluteUrl(`/products/${product.id}`),
    ...(product.company ? { brand: { "@type": "Brand", name: product.company } } : {}),
    ...(product.images?.[0]?.url ? { image: [product.images[0].url] } : {}),
    ...(product.ingredients?.length
      ? {
          description: `${product.name} 주요 성분 ${product.ingredientsCount}종의 함량과 적정 섭취량, 실제 사용자 후기를 확인하세요.`,
        }
      : {}),
    ...(hasRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.reviewAvg).toFixed(2),
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(params: {
  headline: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    inLanguage: "ko-KR",
    mainEntityOfPage: absoluteUrl(params.path),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.png"),
      },
    },
  };
}
