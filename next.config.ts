import type { NextConfig } from 'next';

/**
 * 이미지 원본 호스트 화이트리스트.
 *
 * hostname: '**' 로 열어두면 /_next/image 가 열린 이미지 프록시가 되어
 * 아무 URL이나 우리 대역폭·최적화 쿼터로 변환할 수 있다.
 * 실제로 쓰는 호스트는 배너·제품·리뷰 모두 같은 CloudFront 배포 하나뿐이다.
 *
 * CDN이 바뀌면 NEXT_PUBLIC_CDN_PREFIX 만 갱신하면 되도록 거기서도 호스트를 뽑는다.
 */
const DEFAULT_IMAGE_HOST = 'dlwh1vi7j26ym.cloudfront.net';

function imageHosts(): string[] {
  const hosts = new Set([DEFAULT_IMAGE_HOST]);
  const prefix = process.env.NEXT_PUBLIC_CDN_PREFIX;
  if (prefix) {
    try {
      hosts.add(new URL(prefix).hostname);
    } catch {
      // 프리픽스가 URL 형태가 아니면 무시한다
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  // svg in turbopack setting
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: imageHosts().map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
};

export default nextConfig;
