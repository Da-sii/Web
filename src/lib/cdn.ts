const CDN_PREFIX = (process.env.NEXT_PUBLIC_CDN_PREFIX ?? "").replace(/\/+$/, "");

/**
 * S3 키를 CDN 절대 URL로 바꾼다.
 * 이미 절대 URL(또는 프로토콜 상대 URL)이면 그대로 둔다.
 * 프리픽스가 설정돼 있지 않으면 원본 키를 그대로 돌려준다 — "/key" 를 만들면
 * 브라우저가 현재 도메인 기준 상대경로로 해석해 404가 나기 때문이다.
 */
export function toCdnUrl(key: string | null | undefined): string {
  const trimmed = (key ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) return trimmed;
  if (!CDN_PREFIX) return trimmed;
  return `${CDN_PREFIX}/${trimmed.replace(/^\/+/, "")}`;
}
