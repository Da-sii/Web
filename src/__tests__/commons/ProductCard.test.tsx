import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProductCard } from "@/components/commons/ProductCard";
import type { Product } from "@/types/models";

const base: Product = {
  id: 1,
  name: "테스트 제품",
  company: "테스트 브랜드",
  image: "https://example.com/img.jpg",
  reviewCount: 100,
  reviewAvg: 4.5,
};

describe("ProductCard", () => {
  test("회사명을 렌더한다", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByText("테스트 브랜드")).toBeInTheDocument();
  });

  test("제품명을 렌더한다", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByText("테스트 제품")).toBeInTheDocument();
  });

  test("별점 평균과 리뷰 수를 렌더한다", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByText("4.50")).toBeInTheDocument();
    expect(screen.getByText("(100)")).toBeInTheDocument();
  });

  test("image가 빈 문자열이면 placeholder 텍스트를 표시한다", () => {
    render(<ProductCard product={{ ...base, image: "" }} />);
    expect(screen.getByText("상품 이미지를 준비중입니다")).toBeInTheDocument();
  });

  test("reviewAvg가 null이면 0점 / 0건으로 표시한다", () => {
    render(<ProductCard product={{ ...base, reviewAvg: null, reviewCount: 0 }} />);
    expect(screen.getByText("0.00")).toBeInTheDocument();
    expect(screen.getByText("(0)")).toBeInTheDocument();
  });

  test("제품 상세 링크를 포함한다", () => {
    render(<ProductCard product={base} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/1");
  });
});
