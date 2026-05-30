import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductDetail } from "@/lib/api";
import { ProductDetailPage } from "@/components/pages/ProductDetail/ProductDetailPage";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    return { title: "제품" };
  }
  const product = await fetchProductDetail(parsedId).catch(() => null);
  return { title: product?.name ?? "제품" };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    notFound();
  }
  const product = await fetchProductDetail(parsedId);
  if (!product) {
    notFound();
  }
  return <ProductDetailPage product={product} />;
}
