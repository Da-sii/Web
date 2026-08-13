/**
 * 쿠팡 파트너스 링크는 더 이상 제품 상세 응답의 `coupang` 필드로 오지 않는다.
 * 백엔드가 파트너스 딥링크를 만들어 302로 넘겨주는 리다이렉트 엔드포인트를 쓴다.
 * (앱 `components/page/product/productDetail/CoupangTabBar.tsx` 와 동일한 규칙)
 */
export function getCoupangRedirectUrl(
  productId: number | string,
): string | null {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!base) return null;
  return `${base}/products/${encodeURIComponent(String(productId))}/coupang/`;
}
