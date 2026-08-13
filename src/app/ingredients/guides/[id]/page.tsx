import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchIngredientGuideDetail } from "@/lib/api";
import { IngredientGuideDetailPage } from "@/components/pages/IngredientGuides/IngredientGuideDetailPage";
import { JsonLd } from "@/components/commons/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site";

type Params = Promise<{ id: string }>;

function parseGuideId(id: string): number | null {
  const parsed = Number(id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildDescription(name: string, mainIngredients?: string): string {
  const main = mainIngredients?.trim();
  return main
    ? `${name}(${main})의 효능, 적정 섭취량, 주의사항을 다시에서 확인하세요.`
    : `${name}의 효능, 적정 섭취량, 주의사항을 다시에서 확인하세요.`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseGuideId(id);
  if (parsedId === null) return { title: "성분 가이드" };

  const guide = await fetchIngredientGuideDetail(parsedId).catch(() => null);
  if (!guide) return { title: "성분 가이드" };

  const canonical = absoluteUrl(`/ingredients/guides/${guide.id}`);
  const description = buildDescription(guide.name, guide.mainIngredients);

  return {
    title: guide.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${guide.name} - Dasii`,
      description,
      url: canonical,
      siteName: "다시",
      locale: "ko_KR",
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const parsedId = parseGuideId(id);
  if (parsedId === null) {
    notFound();
  }

  const guide = await fetchIngredientGuideDetail(parsedId);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: guide.name,
          description: buildDescription(guide.name, guide.mainIngredients),
          path: `/ingredients/guides/${guide.id}`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", path: "/" },
          { name: "성분 가이드", path: "/ingredients/guides" },
          { name: guide.name, path: `/ingredients/guides/${guide.id}` },
        ])}
      />
      <IngredientGuideDetailPage guide={guide} />
    </>
  );
}
