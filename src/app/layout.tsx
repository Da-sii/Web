import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "@/styles/globals.css";
import { Header } from "@/components/commons/Header";
import { BottomBar } from "@/components/commons/BottomBar";
import { ScrollArea } from "@/components/commons/ScrollArea";
import { NavProgressBar, NavProgressProvider } from "@/components/commons/NavProgress";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/site";
import { ANDROID_STORE_URL, IOS_STORE_URL, STORE_QR } from "@/lib/app-store";

export const metadata: Metadata = {
  title: {
    default: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    template: '%s - Dasii',
  },
  description: '다이어트 보조제 성분 분석 및 후기 서비스',
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  // OG (소셜 공유 미리보기)
  openGraph: {
    title: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    description: '다이어트 보조제 성분 분석 및 후기 서비스',
    url: SITE_URL,
    siteName: '다시',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '다시 og 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    description: '다이어트 보조제 성분 분석 및 후기 서비스',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  verification: {
    other: {
      'naver-site-verification': '5781b32ce164e322b527d7e034097eec64b8e45d',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="relative flex items-start bg-green50">
        <aside className="sticky top-0 flex h-screen flex-1 items-end">
          <div className="hidden md:flex flex-col items-center w-full justify-center px-6 py-20">
            <div className="relative w-full max-w-46.75 h-13.75">
              <Image
                src="/images/logo.png"
                fill
                alt="로고"
                className="object-contain"
              />
            </div>
            <span className="flex flex-col lg:flex-row gap-1 mt-7.5 mb-3.5 title-lg-extrabold">
              <p>나를 위한</p>
              <p>똑똑한 선택</p>
            </span>
            <div className="flex flex-col items-start lg:items-center text-[17px] lg:text-[20px] leading-4 lg:leading-6 font-normal mb-7.5 gap-3 lg:gap-1">
              <span className="flex flex-col lg:flex-row gap-1">
                <p>다이어트를 위한</p>
                <p>성분 분석부터</p>
              </span>
              <span className="flex flex-col lg:flex-row gap-1">
                <p>실제 후기까지,</p>
                <p>필요한 정보를</p>
              </span>
              <span className="flex flex-col lg:flex-row gap-1">
                <p>한 번에</p>
                <p>확인해보세요!</p>
              </span>
            </div>
            <div className="flex gap-4 lg:gap-8.75 mb-2.5">
              <a href={ANDROID_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Image src={STORE_QR.android} alt="플레이스토어 설치 QR" width={148} height={148} />
              </a>
              <a href={IOS_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Image src={STORE_QR.ios} alt="앱스토어 설치 QR" width={148} height={148} />
              </a>
            </div>
            <div className="flex gap-4 lg:gap-8.75 w-full max-w-75 justify-center">
              <span className="title-sm-extrabold flex-1 flex justify-center">Android</span>
              <span className="title-sm-extrabold flex-1 flex justify-center">iPhone</span>
            </div>
          </div>
        </aside>
        <NavProgressProvider>
          <main className="relative flex flex-col w-full max-w-lg min-h-screen bg-background">
            <NavProgressBar />
            <Header />
            <ScrollArea>{children}</ScrollArea>
            <BottomBar />
          </main>
        </NavProgressProvider>
        <aside className="sticky top-0 h-screen flex-1" />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
