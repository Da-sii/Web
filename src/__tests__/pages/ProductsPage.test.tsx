import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { TabSwitcher } from "@/components/pages/Products/components/TabSwitcher";
import { SubcategoryFilter } from "@/components/pages/Products/components/SubcategoryFilter";
import { ProductsToolbar } from "@/components/pages/Products/components/ProductsToolbar";
import { ProductsPage } from "@/components/pages/Products/ProductsPage";
import type { Category, Product } from "@/types/models";

vi.mock("@/lib/api", () => ({
  fetchProducts: vi.fn().mockResolvedValue({
    count: 2,
    next: null,
    previous: null,
    results: [],
  }),
  fetchCategories: vi.fn().mockResolvedValue([]),
}));

const mockProducts: Product[] = [
  { id: 1, name: "제품1", company: "브랜드1", image: "", reviewCount: 10, reviewAvg: 4.0 },
  { id: 2, name: "제품2", company: "브랜드2", image: "", reviewCount: 5, reviewAvg: 3.5 },
];

const mockCategories: Category[] = [
  {
    category: "다이어트",
    middleCategories: [
      { category: "체지방 감소", smallCategories: ["가르시니아", "공액리놀레산"] },
      { category: "탄수화물 컷", smallCategories: ["흰강낭콩"] },
    ],
  },
  {
    category: "에너지",
    middleCategories: [{ category: "카페인", smallCategories: ["카페인무수물"] }],
  },
];

// ── TabSwitcher ────────────────────────────────────────────────────────────────

describe("TabSwitcher", () => {
  const tabs = ["전체", "체지방 감소", "탄수화물 컷"];

  test("모든 탭을 렌더한다", () => {
    render(<TabSwitcher tabs={tabs} activeTab="전체" onTabChange={vi.fn()} />);
    tabs.forEach((t) => expect(screen.getByText(t)).toBeInTheDocument());
  });

  test("활성 탭에 font-bold 클래스가 있다", () => {
    render(<TabSwitcher tabs={tabs} activeTab="체지방 감소" onTabChange={vi.fn()} />);
    expect(screen.getByText("체지방 감소")).toHaveClass("font-bold");
  });

  test("탭 클릭 시 onTabChange를 호출한다", () => {
    const onTabChange = vi.fn();
    render(<TabSwitcher tabs={tabs} activeTab="전체" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText("탄수화물 컷"));
    expect(onTabChange).toHaveBeenCalledWith("탄수화물 컷");
  });
});

// ── SubcategoryFilter ─────────────────────────────────────────────────────────

describe("SubcategoryFilter", () => {
  const options = ["가르시니아", "공액리놀레산", "흰강낭콩"];

  test("모든 pills를 렌더한다", () => {
    render(<SubcategoryFilter options={options} activeOption="" onSelect={vi.fn()} />);
    options.forEach((o) => expect(screen.getByText(o)).toBeInTheDocument());
  });

  test("활성 pill에 bg-green500 클래스가 있다", () => {
    render(<SubcategoryFilter options={options} activeOption="가르시니아" onSelect={vi.fn()} />);
    expect(screen.getByText("가르시니아")).toHaveClass("bg-green500");
  });

  test("pill 클릭 시 onSelect를 호출한다", () => {
    const onSelect = vi.fn();
    render(<SubcategoryFilter options={options} activeOption="" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("흰강낭콩"));
    expect(onSelect).toHaveBeenCalledWith("흰강낭콩");
  });
});

// ── ProductsToolbar ───────────────────────────────────────────────────────────

describe("ProductsToolbar", () => {
  test("총 개수를 표시한다", () => {
    render(
      <ProductsToolbar
        totalCount={42}
        sort="monthly_rank"
        onSortChange={vi.fn()}
        viewMode="grid"
        onViewModeChange={vi.fn()}
      />,
    );
    expect(screen.getByText("총 42개")).toBeInTheDocument();
  });

  test("정렬 레이블을 표시한다", () => {
    render(
      <ProductsToolbar
        totalCount={10}
        sort="monthly_rank"
        onSortChange={vi.fn()}
        viewMode="grid"
        onViewModeChange={vi.fn()}
      />,
    );
    expect(screen.getByText("랭킹순")).toBeInTheDocument();
  });

  test("뷰 토글 버튼들을 렌더한다", () => {
    render(
      <ProductsToolbar
        totalCount={10}
        sort="monthly_rank"
        onSortChange={vi.fn()}
        viewMode="grid"
        onViewModeChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("그리드 뷰")).toBeInTheDocument();
    expect(screen.getByLabelText("리스트 뷰")).toBeInTheDocument();
  });
});

// ── ProductsPage ──────────────────────────────────────────────────────────────

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("제품들을 그리드로 렌더한다", () => {
    render(
      <ProductsPage
        initialProducts={mockProducts}
        initialCount={2}
        categories={mockCategories}
        initialBigCategory="다이어트"
        initialMiddleCategory=""
        initialSmallCategory=""
        initialSort="monthly_rank"
      />,
    );
    const grid = screen.getByTestId("product-grid");
    expect(grid).toBeInTheDocument();
    expect(screen.getByText("제품1")).toBeInTheDocument();
    expect(screen.getByText("제품2")).toBeInTheDocument();
  });

  test("리스트 뷰 토글 시 product-list가 렌더된다", () => {
    render(
      <ProductsPage
        initialProducts={mockProducts}
        initialCount={2}
        categories={mockCategories}
        initialBigCategory="다이어트"
        initialMiddleCategory=""
        initialSmallCategory=""
        initialSort="monthly_rank"
      />,
    );
    fireEvent.click(screen.getByLabelText("리스트 뷰"));
    expect(screen.getByTestId("product-list")).toBeInTheDocument();
    expect(screen.queryByTestId("product-grid")).not.toBeInTheDocument();
  });

  test("중분류 탭들을 렌더한다", () => {
    render(
      <ProductsPage
        initialProducts={mockProducts}
        initialCount={2}
        categories={mockCategories}
        initialBigCategory="다이어트"
        initialMiddleCategory=""
        initialSmallCategory=""
        initialSort="monthly_rank"
      />,
    );
    expect(screen.getByText("체지방 감소")).toBeInTheDocument();
    expect(screen.getByText("탄수화물 컷")).toBeInTheDocument();
  });
});
