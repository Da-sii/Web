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
