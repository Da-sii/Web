import { notFound } from "next/navigation";
import { fetchIngredientGuideDetail } from "@/lib/api";
import { IngredientGuideDetailPage } from "@/components/pages/IngredientGuides/IngredientGuideDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = Number(id);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    notFound();
  }

  const guide = await fetchIngredientGuideDetail(parsedId);
  return <IngredientGuideDetailPage guide={guide} />;
}
