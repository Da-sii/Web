import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const CDN = "https://dlwh1vi7j26ym.cloudfront.net";

/** cdn.ts 는 모듈 로드 시점에 env를 읽으므로 매번 새로 import 한다. */
async function loadToCdnUrl(prefix: string | undefined) {
  vi.resetModules();
  if (prefix === undefined) delete process.env.NEXT_PUBLIC_CDN_PREFIX;
  else process.env.NEXT_PUBLIC_CDN_PREFIX = prefix;
  return (await import("@/lib/cdn")).toCdnUrl;
}

const originalPrefix = process.env.NEXT_PUBLIC_CDN_PREFIX;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (originalPrefix === undefined) delete process.env.NEXT_PUBLIC_CDN_PREFIX;
  else process.env.NEXT_PUBLIC_CDN_PREFIX = originalPrefix;
});

describe("toCdnUrl", () => {
  test("리뷰 이미지 S3 키에 CDN 오리진을 붙인다", async () => {
    const toCdnUrl = await loadToCdnUrl(CDN);
    // 실제 API 응답 형태: reviews[].images[].url 은 버킷 루트 기준 키다
    expect(toCdnUrl("4/6/1fdf6c74-d6e3-4250-a276-7e8e718f1e80.jpeg")).toBe(
      `${CDN}/4/6/1fdf6c74-d6e3-4250-a276-7e8e718f1e80.jpeg`,
    );
  });

  test("이미 절대 URL이면 그대로 둔다", async () => {
    const toCdnUrl = await loadToCdnUrl(CDN);
    // product_info.image 는 완전한 URL로 온다
    const abs = `${CDN}/products/0b444bec-c7a9-450c-831e-70a154965b64_Frame 34.png`;
    expect(toCdnUrl(abs)).toBe(abs);
    expect(toCdnUrl("http://example.com/a.png")).toBe("http://example.com/a.png");
    expect(toCdnUrl("//example.com/a.png")).toBe("//example.com/a.png");
  });

  test("프리픽스 끝 슬래시와 키 앞 슬래시가 겹쳐도 중복되지 않는다", async () => {
    const toCdnUrl = await loadToCdnUrl(`${CDN}/`);
    expect(toCdnUrl("/4/6/a.jpeg")).toBe(`${CDN}/4/6/a.jpeg`);
  });

  test("프리픽스가 없으면 원본 키를 그대로 둔다 (상대경로 404 방지)", async () => {
    const toCdnUrl = await loadToCdnUrl("");
    // "/4/6/a.jpeg" 를 만들면 브라우저가 web.dasii.kr 기준으로 읽어 404가 난다
    expect(toCdnUrl("4/6/a.jpeg")).toBe("4/6/a.jpeg");
  });

  test("빈 값은 빈 문자열", async () => {
    const toCdnUrl = await loadToCdnUrl(CDN);
    expect(toCdnUrl("")).toBe("");
    expect(toCdnUrl(null)).toBe("");
    expect(toCdnUrl(undefined)).toBe("");
  });
});
