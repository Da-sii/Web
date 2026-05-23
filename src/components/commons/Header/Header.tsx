import Link from "next/link";
import Image from "next/image";
import SearchIcon from "@/assets/icons/ic_search.svg";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4">
      <Link href="/" aria-label="홈으로 이동">
        <Image
          src="/images/logo.png"
          alt="다시 로고"
          width={100}
          height={18}
          className="h-4.5 w-auto"
        />
      </Link>
      <Link href="/search" aria-label="검색">
        <SearchIcon className="h-4.5 w-4.5" />
      </Link>
    </header>
  );
}
