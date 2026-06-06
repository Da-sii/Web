import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProductListRow } from "@/components/commons/ProductListRow";
import type { Product } from "@/types/models";

const base: Product = {
  id: 2,
  name: "리스트 제품",
  company: "리스트 브랜드",
  image: "https://example.com/img.jpg",
  reviewCount: 50,
  reviewAvg: 3.8,
};

describe("ProductListRow", () => {
  test("회사명과 제품명을 렌더한다", () => {
    render(<ProductListRow product={base} />);
    expect(screen.getByText("리스트 브랜드")).toBeInTheDocument();
    expect(screen.getByText("리스트 제품")).toBeInTheDocument();
  });

  test("별점 정보를 렌더한다", () => {
    render(<ProductListRow product={base} />);
    expect(screen.getByText("3.80")).toBeInTheDocument();
    expect(screen.getByText("(50)")).toBeInTheDocument();
  });

  test("leftBadge가 주어지면 렌더한다", () => {
    render(<ProductListRow product={base} leftBadge={<span>1</span>} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("leftBadge가 없으면 badge 컨테이너를 렌더하지 않는다", () => {
    const { container } = render(<ProductListRow product={base} />);
    expect(container.querySelector('[data-testid="left-badge"]')).toBeNull();
  });

  test("image가 빈 문자열이면 placeholder를 표시한다", () => {
    render(<ProductListRow product={{ ...base, image: "" }} />);
    expect(screen.getByText("상품 이미지를 준비중입니다")).toBeInTheDocument();
  });

  test("제품 상세 링크를 포함한다", () => {
    render(<ProductListRow product={base} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/2");
  });

  test("reviewAvg가 null이면 '리뷰 없음'을 표시한다", () => {
    render(<ProductListRow product={{ ...base, reviewAvg: null, reviewCount: 0 }} />);
    expect(screen.getByText("리뷰 없음")).toBeInTheDocument();
  });
});
