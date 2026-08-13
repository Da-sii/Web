import { afterEach, describe, expect, test, vi } from "vitest";
import { dedupeMainBanners, fetchBanners, getBannerDetailImages } from "@/lib/api";
import type { Banner } from "@/types/models";

function mockBannersResponse(payload: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchBanners", () => {
  test("신 스키마의 detail_images 를 order 순으로 펼친다", async () => {
    mockBannersResponse([
      {
        id: 1,
        image_url: "https://cdn/b1.jpg",
        order: 1,
        detail_images: [
          { id: 12, detail_image_url: "https://cdn/b1_2.jpg", order: 2 },
          { id: 11, detail_image_url: "https://cdn/b1_1.jpg", order: 1 },
        ],
      },
    ]);

    const banners = await fetchBanners();
    expect(banners[0].detailImages).toEqual([
      "https://cdn/b1_1.jpg",
      "https://cdn/b1_2.jpg",
    ]);
  });

  test("구 스키마(detail_image_url 단일)로 폴백한다", async () => {
    mockBannersResponse([
      {
        id: 1,
        image_url: "https://cdn/b1.jpg",
        detail_image_url: "https://cdn/b1_detail.jpg",
        order: 1,
      },
    ]);

    const banners = await fetchBanners();
    expect(banners[0].detailImages).toEqual(["https://cdn/b1_detail.jpg"]);
  });

  test("상세 이미지가 없으면 빈 배열이다", async () => {
    mockBannersResponse([
      { id: 1, image_url: "https://cdn/b1.jpg", detail_image_url: null, order: 1 },
    ]);

    const banners = await fetchBanners();
    expect(banners[0].detailImages).toEqual([]);
  });
});

describe("dedupeMainBanners", () => {
  test("order 당 하나만 남기고 order 순으로 정렬한다", () => {
    const banners: Banner[] = [
      { id: 3, imageUrl: "b2", detailImages: [], order: 2 },
      { id: 1, imageUrl: "b1", detailImages: [], order: 1 },
      { id: 2, imageUrl: "b1-dup", detailImages: [], order: 1 },
    ];
    expect(dedupeMainBanners(banners).map((b) => b.id)).toEqual([1, 3]);
  });
});

describe("getBannerDetailImages", () => {
  test("신 스키마: 해당 order 배너의 detailImages 를 돌려준다", () => {
    const banners: Banner[] = [
      { id: 1, imageUrl: "b1", detailImages: ["a.jpg", "b.jpg"], order: 1 },
      { id: 2, imageUrl: "b2", detailImages: ["c.jpg"], order: 2 },
    ];
    expect(getBannerDetailImages(banners, 1)).toEqual(["a.jpg", "b.jpg"]);
  });

  test("구 스키마: 같은 order 의 row 들을 이어붙인다", () => {
    const banners: Banner[] = [
      { id: 1, imageUrl: "b1", detailImages: ["a.jpg"], order: 1 },
      { id: 2, imageUrl: "b1", detailImages: ["b.jpg"], order: 1 },
    ];
    expect(getBannerDetailImages(banners, 1)).toEqual(["a.jpg", "b.jpg"]);
  });

  test("없는 order 면 빈 배열", () => {
    expect(getBannerDetailImages([], 9)).toEqual([]);
  });
});
