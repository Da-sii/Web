import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { RankingItem } from "@/components/pages/Ranking/components/RankingItem";
import { RankingPage } from "@/components/pages/Ranking/RankingPage";
import type { RankingProduct, RankingCategoryItem } from "@/types/models";

vi.mock("@/lib/api", () => ({
  fetchRanking: vi.fn().mockResolvedValue({
    count: 2,
    next: null,
    previous: null,
    results: [],
  }),
}));

const mockProduct: RankingProduct = {
  id: 1,
  name: "랭킹 제품",
  company: "랭킹 브랜드",
  image: "",
  reviewCount: 200,
  reviewAvg: 4.2,
  rankDiff: null,
};

const mockCategories: RankingCategoryItem[] = [
  { bigCategory: "다이어트", middleCategory: "체지방", smallCategory: "가르시니아" },
  { bigCategory: "다이어트", middleCategory: "체지방", smallCategory: "카르니틴" },
];

describe("RankingItem", () => {
  test("rank ≤ 3이면 배지가 green500 클래스를 가진다", () => {
    render(<RankingItem product={mockProduct} rank={1} />);
    const badge = screen.getByTestId("rank-badge");
    expect(badge).toHaveClass("bg-green500");
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("rank > 3이면 배지가 gray400 클래스를 가진다", () => {
    render(<RankingItem product={mockProduct} rank={4} />);
    const badge = screen.getByTestId("rank-badge");
    expect(badge).toHaveClass("bg-gray400");
  });

  test("rankDiff === null이면 NEW를 표시한다", () => {
    render(<RankingItem product={{ ...mockProduct, rankDiff: null }} rank={1} />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  test("rankDiff > 0이면 ▲와 수치를 표시한다", () => {
    render(<RankingItem product={{ ...mockProduct, rankDiff: 3 }} rank={2} />);
    expect(screen.getByText("▲3")).toBeInTheDocument();
  });

  test("rankDiff === 0이면 — 를 표시한다", () => {
    render(<RankingItem product={{ ...mockProduct, rankDiff: 0 }} rank={2} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("rankDiff < 0이면 ▼와 절대값을 표시한다", () => {
    render(<RankingItem product={{ ...mockProduct, rankDiff: -2 }} rank={3} />);
    expect(screen.getByText("▼2")).toBeInTheDocument();
  });
});

describe("RankingPage", () => {
  const mockProducts: RankingProduct[] = [
    { id: 1, name: "제품1", company: "브랜드1", image: "", reviewCount: 10, reviewAvg: 4.0, rankDiff: null },
    { id: 2, name: "제품2", company: "브랜드2", image: "", reviewCount: 5, reviewAvg: 3.5, rankDiff: 2 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("period 탭을 렌더한다", () => {
    render(
      <RankingPage
        initialProducts={mockProducts}
        initialPeriod="daily"
        categories={mockCategories}
      />,
    );
    expect(screen.getByText("현재 급상승 랭킹")).toBeInTheDocument();
    expect(screen.getByText("월간 랭킹")).toBeInTheDocument();
  });

  test("카테고리 필터 pills를 렌더한다", () => {
    render(
      <RankingPage
        initialProducts={mockProducts}
        initialPeriod="daily"
        categories={mockCategories}
      />,
    );
    expect(screen.getByText("전체")).toBeInTheDocument();
    expect(screen.getByText("가르시니아")).toBeInTheDocument();
    expect(screen.getByText("카르니틴")).toBeInTheDocument();
  });

  test("랭킹 아이템들을 렌더한다", () => {
    render(
      <RankingPage
        initialProducts={mockProducts}
        initialPeriod="daily"
        categories={mockCategories}
      />,
    );
    expect(screen.getByText("제품1")).toBeInTheDocument();
    expect(screen.getByText("제품2")).toBeInTheDocument();
  });

  test("daily 탭에서 초기화 버튼을 표시한다", () => {
    render(
      <RankingPage
        initialProducts={mockProducts}
        initialPeriod="daily"
        categories={mockCategories}
      />,
    );
    expect(screen.getByText("초기화")).toBeInTheDocument();
  });

  test("monthly 탭에서 초기화 버튼을 표시하지 않는다", () => {
    render(
      <RankingPage
        initialProducts={mockProducts}
        initialPeriod="monthly"
        categories={mockCategories}
      />,
    );
    expect(screen.queryByText("초기화")).not.toBeInTheDocument();
  });
});
