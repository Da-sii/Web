import type { Metadata } from 'next';
import HomePage from '../components/pages/Home/Home';
import { JsonLd } from '@/components/commons/JsonLd';
import { organizationJsonLd, webSiteJsonLd } from '@/lib/structured-data';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
  description:
    '다이어트 보조제 성분 분석 및 후기 서비스',
  keywords: [
    '다이어트',
    '다이어트 보조제',
    '성분 분석',
    '후기',
    '건강 기능 식품',
  ],

  // Open Graph (카톡, 페북 등 공유)
  openGraph: {
    title: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    description: '다이어트 보조제 성분 분석 및 후기 서비스',
    url: SITE_URL,
    siteName: '다시',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dasii',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // 트위터 카드
  twitter: {
    card: 'summary_large_image',
    title: '다시 - 다이어트 보조제 성분 분석 및 후기 서비스',
    description: '다이어트 보조제 성분 분석 및 후기 서비스',
    images: ['/og-image.png'],
  },

  // 추가 SEO
  robots: {
    index: true,
    follow: true,
  },

  // canonical
  alternates: {
    canonical: absoluteUrl('/'),
  },

  // naver-site-verification 은 전 페이지에 적용되도록 layout.tsx 로 옮겼다.
};

export default function Page() {
  return (
    <>
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <HomePage />
    </>
  );
}
