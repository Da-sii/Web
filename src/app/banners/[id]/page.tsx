import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBanners, getBannerDetailImages } from "@/lib/api";

interface BannerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BannerDetailPage({ params }: BannerDetailPageProps) {
  const { id } = await params;
  const order = Number(id);
  if (!Number.isFinite(order)) notFound();

  const banners = await fetchBanners();
  const detailBanners = getBannerDetailImages(banners, order);

  if (detailBanners.length === 0) notFound();

  return (
    <section className="flex flex-col">
      {detailBanners.map((banner) => (
        <div key={banner.id} className="relative aspect-[10/13] w-full bg-muted">
          <Image
            src={banner.detailImageUrl}
            alt={`배너 ${banner.order} 상세 ${banner.id}`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
            priority
          />
        </div>
      ))}
    </section>
  );
}
