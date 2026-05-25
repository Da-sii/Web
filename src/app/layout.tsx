import type { Metadata } from "next";
import Image from "next/image";
import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/commons/Header";
import { BottomBar } from "@/components/commons/BottomBar";
import { ScrollArea } from "@/components/commons/ScrollArea";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    template: '%s - Dasii',
  },
  description: '다이어트 보조제 성분 분석 및 후기 서비스',
  metadataBase: new URL('https://linkiving.com'),
  // OG (소셜 공유 미리보기)
  openGraph: {
    title: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    description: '다이어트 보조제 성분 분석 및 후기 서비스',
    url: 'https://dasii.com',
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
    apple: '/apple-touch-icon.png',
  },

  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="relative flex items-center bg-green50">
        <aside className="flex h-screen flex-1 items-end">
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
              <a href="https://play.google.com/store/apps/details?id=com.dasii&pcampaignid=web_share" >
                <Image src='/images/qr_android.png' alt="플레이스토어 설치 QR" width={148} height={148} />
              </a>
              <a href="https://apps.apple.com/kr/app/%EB%8B%A4%EC%8B%9C-%EB%8B%A4%EC%9D%B4%EC%96%B4%ED%8A%B8-%EB%B3%B4%EC%A1%B0%EC%A0%9C-%EC%84%B1%EB%B6%84-%EB%B6%84%EC%84%9D-%EB%B0%8F-%ED%9B%84%EA%B8%B0-%EC%84%9C%EB%B9%84%EC%8A%A4/id6754357876" >
                <Image src='/images/qr_iOS.png' alt="앱스토어 설치 QR" width={148} height={148} />
              </a>
            </div>
            <div className="flex gap-4 lg:gap-8.75 w-full max-w-75 justify-center">
              <span className="title-sm-extrabold flex-1 flex justify-center">Android</span>
              <span className="title-sm-extrabold flex-1 flex justify-center">iPhone</span>
            </div>
          </div>
        </aside>
        <main className="flex flex-col w-full max-w-lg h-screen bg-background">
          <Header />
          <ScrollArea>{children}</ScrollArea>
          <BottomBar />
        </main>
        <aside className="flex-1">

        </aside>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
