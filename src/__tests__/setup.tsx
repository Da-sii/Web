import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

process.env.NEXT_PUBLIC_API_URL = "http://test-api";

// jsdom에는 IntersectionObserver가 없다 (무한스크롤 sentinel이 사용).
if (!("IntersectionObserver" in globalThis)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
}

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack, replace: mockReplace }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
