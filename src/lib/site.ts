const DEFAULT_SITE_URL = "https://dasii.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/+$/, "");

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
