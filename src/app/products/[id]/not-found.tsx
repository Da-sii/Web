import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <p className="text-base font-semibold">제품을 찾을 수 없습니다 😢</p>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-green600 px-6 text-sm font-semibold text-white"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
