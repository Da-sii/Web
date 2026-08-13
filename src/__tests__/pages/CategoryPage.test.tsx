import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CategoryPage } from "@/components/pages/Category/CategoryPage";
import type { Category } from "@/types/models";

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
    middleCategories: [
      { category: "카페인", smallCategories: ["카페인무수물"] },
    ],
  },
];

describe("CategoryPage", () => {
  test("모든 대분류를 왼쪽 컬럼에 렌더한다", () => {
    render(<CategoryPage categories={mockCategories} />);
    expect(screen.getByText("다이어트")).toBeInTheDocument();
    expect(screen.getByText("에너지")).toBeInTheDocument();
  });

  test("첫 번째 대분류가 기본 활성화된다", () => {
    render(<CategoryPage categories={mockCategories} />);
    expect(screen.getByText("체지방 감소")).toBeInTheDocument();
    expect(screen.getByText("탄수화물 컷")).toBeInTheDocument();
  });

  test("다른 대분류 클릭 시 해당 중분류로 전환된다", () => {
    render(<CategoryPage categories={mockCategories} />);
    fireEvent.click(screen.getByText("에너지"));
    expect(screen.getByText("카페인")).toBeInTheDocument();
    expect(screen.queryByText("체지방 감소")).not.toBeInTheDocument();
  });

  test("중분류마다 전체 보기 링크를 렌더한다", () => {
    const { container } = render(<CategoryPage categories={mockCategories} />);
    // 중분류 헤더의 화살표 링크 = sub 없이 해당 중분류 "전체"로 이동
    const allLinks = container.querySelectorAll(
      'a[href*="/category/list?"]:not([href*="sub="])',
    );
    expect(allLinks.length).toBe(mockCategories[0].middleCategories.length);
  });

  test("소분류 링크가 올바른 URL을 가진다", () => {
    render(<CategoryPage categories={mockCategories} />);
    const link = screen.getByRole("link", { name: "가르시니아" });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("sub=%EA%B0%80%EB%A5%B4%EC%8B%9C%EB%8B%88%EC%95%84"),
    );
  });

  test("전체 보기 링크가 /category/list 로 이동한다", () => {
    const { container } = render(<CategoryPage categories={mockCategories} />);
    const allLinks = container.querySelectorAll(
      'a[href*="/category/list?"]:not([href*="sub="])',
    );
    expect(allLinks[0]).toHaveAttribute(
      "href",
      expect.stringContaining("/category/list?main="),
    );
  });

  test("빈 카테고리 배열이면 빈 상태를 렌더한다", () => {
    const { container } = render(<CategoryPage categories={[]} />);
    expect(container.firstChild).toBeTruthy();
  });
});
