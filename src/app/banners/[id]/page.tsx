import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBanners, getBannerDetailImages } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";

interface BannerDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BannerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = Number(id);
  if (!Number.isFinite(order)) return { title: "뉴스" };
  return {
    title: "뉴스",
    description: "다시가 전하는 다이어트 보조제 소식",
    alternates: { canonical: absoluteUrl(`/banners/${order}`) },
  };
}

export default async function BannerDetailPage({ params }: BannerDetailPageProps) {
  const { id } = await params;
  const order = Number(id);
  if (!Number.isFinite(order)) notFound();

  const banners = await fetchBanners();
  const detailImages = getBannerDetailImages(banners, order);

  if (detailImages.length === 0) notFound();

  return (
    <section className="flex flex-col">
      {detailImages.map((src, idx) => (
        <div key={src} className="relative aspect-[10/13] w-full bg-muted">
          <Image
            src={src}
            alt={`배너 ${order} 상세 ${idx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
            // 첫 장만 즉시 로드하고 나머지는 지연 — 상세는 8장까지 올 수 있다
            priority={idx === 0}
          />
        </div>
      ))}
    </section>
  );
}
