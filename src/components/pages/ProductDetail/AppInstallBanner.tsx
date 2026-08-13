import { ANDROID_STORE_URL, IOS_STORE_URL } from "@/lib/app-store";

export function AppInstallBanner() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#F6F5FA] px-5 py-6 text-center">
      <p className="text-sm font-semibold text-gray-700">
        더 많은 리뷰는 앱에서 확인하세요
      </p>
      <p className="text-xs text-gray-400">
        앱을 설치하면 모든 리뷰를 보고 직접 작성할 수 있어요.
      </p>
      <div className="flex gap-2">
        <a
          href={ANDROID_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-green600 px-5 text-sm font-semibold text-white"
        >
          Android 설치
        </a>
        <a
          href={IOS_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-semibold text-white"
        >
          iPhone 설치
        </a>
      </div>
    </div>
  );
}
