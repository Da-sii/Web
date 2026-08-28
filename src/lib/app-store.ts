/** 앱 스토어 링크와 앱 정보 단일 소스. 하드코딩 복제를 막기 위해 여기서만 관리한다. */

export const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.dasii&pcampaignid=web_share";

export const IOS_STORE_URL =
  "https://apps.apple.com/kr/app/%EB%8B%A4%EC%8B%9C-%EB%8B%A4%EC%9D%B4%EC%96%B4%ED%8A%B8-%EB%B3%B4%EC%A1%B0%EC%A0%9C-%EC%84%B1%EB%B6%84-%EB%B6%84%EC%84%9D-%EB%B0%8F-%ED%9B%84%EA%B8%B0-%EC%84%9C%EB%B9%84%EC%8A%A4/id6754357876";

/** 앱 저장소 app.json 의 version 과 맞춘다. */
export const APP_VERSION = "1.5.2";

/** 앱 마이페이지 '문의 메일' 과 동일 */
export const SUPPORT_EMAIL = "podostore1111@gmail.com";

export const STORE_QR = {
  android: "/images/qr_android.png",
  ios: "/images/qr_iOS.png",
} as const;

export type MobileOS = "ios" | "android" | "other";

/**
 * 브라우저 UA로 모바일 OS를 판별한다.
 * 서버에는 navigator가 없으므로 항상 "other"를 돌려준다 — 렌더 중에 부르면
 * 서버/클라이언트 결과가 갈려 하이드레이션이 어긋나니 effect나 핸들러에서만 부를 것.
 */
export function detectMobileOS(): MobileOS {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  // iPadOS 13+ 는 UA를 Macintosh로 위장하므로 터치 지원 여부로 가른다
  if (/Macintosh/.test(ua) && typeof document !== "undefined" && "ontouchend" in document) {
    return "ios";
  }
  return "other";
}

/**
 * 현재 기기에 맞는 스토어 링크.
 * 데스크톱처럼 판별이 안 되는 환경은 Play 스토어 웹 페이지로 보낸다
 * (데스크톱 브라우저에서도 앱 소개가 정상적으로 열린다).
 */
export function resolveStoreUrl(): string {
  return detectMobileOS() === "ios" ? IOS_STORE_URL : ANDROID_STORE_URL;
}
