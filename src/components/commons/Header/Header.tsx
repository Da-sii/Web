import Link from "next/link";
import { Placeholder } from "@/components/commons/Placeholder/Placeholder";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4">
      <Link href="/" aria-label="홈으로 이동">
        <Placeholder
          label="로고"
          className="h-8 w-20 rounded"
        />
      </Link>
      <Link href="/search" aria-label="검색">
        <Placeholder
          label="검색"
          className="h-8 w-8 rounded-full"
        />
      </Link>
    </header>
  );
}
