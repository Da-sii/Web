const CDN_PREFIX = process.env.NEXT_PUBLIC_CDN_PREFIX ?? "";

export function toCdnUrl(key: string): string {
  if (!key) return "";
  if (key.startsWith("http")) return key;
  return `${CDN_PREFIX}/${key}`;
}
