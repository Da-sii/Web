import { describe, expect, it, vi, beforeEach } from "vitest";
import { normalizeSearchKeyword } from "@/lib/daiso";
import { loadDaisoProducts } from "@/components/commons/DaisoProvider";
import { fetchProducts } from "@/lib/api";
vi.mock("@/lib/api", () => ({ fetchProducts: vi.fn() }));
const fetchMock = vi.mocked(fetchProducts);
describe("Daiso", () => {
  beforeEach(() => vi.resetAllMocks());
  it("normalizes exact aliases only", () => {
    for (const word of ["DAISO", " daiso mall ", "다이소 몰", "다이소제품"])
      expect(normalizeSearchKeyword(word)).toBe("다이소");
    expect(normalizeSearchKeyword(" 다이소파스 ")).toBe("다이소파스");
  });
  it("deduplicates pages and retains partial results on failure", async () => {
    const product = { id: 1, name: "A", image: "", company: "", reviewCount: 0, reviewAvg: null };
    fetchMock.mockResolvedValueOnce({ count: 3, next: "next", previous: null, results: [product] })
      .mockResolvedValueOnce({ count: 3, next: "next", previous: null, results: [product, { ...product, id: 2 }] })
      .mockRejectedValueOnce(new Error("offline"));
    expect((await loadDaisoProducts()).map(p => p.id)).toEqual([1, 2]);
  });
  it("caps pagination at twenty pages", async () => {
    fetchMock.mockResolvedValue({ count: 100, next: "next", previous: null, results: [] });
    await loadDaisoProducts();
    expect(fetchMock).toHaveBeenCalledTimes(20);
  });
});
