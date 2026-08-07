import type { Metadata } from 'next';
import HomePage from '../components/pages/Home/Home';

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
    url: 'https://linkiving.com',
    siteName: 'Linkiving',
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
    canonical: 'https://linkiving.com',
  },

  // 배포 후 구글, 네이버 서치 등록
  verification: {
    // google: "todo",
    other: {
      'naver-site-verification': '5781b32ce164e322b527d7e034097eec64b8e45d',
    },
  },
};

export default function Page() {
  return (
    <HomePage/>
  );
}