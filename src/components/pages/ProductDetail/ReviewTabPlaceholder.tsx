import { MessageSquareText } from "lucide-react";

const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.dasii&pcampaignid=web_share";
const IOS_URL =
  "https://apps.apple.com/kr/app/%EB%8B%A4%EC%8B%9C-%EB%8B%A4%EC%9D%B4%EC%96%B4%ED%8A%B8-%EB%B3%B4%EC%A1%B0%EC%A0%9C-%EC%84%B1%EB%B6%84-%EB%B6%84%EC%84%9D-%EB%B0%8F-%ED%9B%84%EA%B8%B0-%EC%84%9C%EB%B9%84%EC%8A%A4/id6754357876";

export function ReviewTabPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <MessageSquareText className="size-10 text-gray-300" />
      <p className="text-sm text-muted-foreground">
        리뷰는 앱에서 확인할 수 있어요.
      </p>
      <div className="mt-2 flex gap-3">
        <a
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-green600 px-5 text-sm font-semibold text-white"
        >
          Android 설치
        </a>
        <a
          href={IOS_URL}
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
