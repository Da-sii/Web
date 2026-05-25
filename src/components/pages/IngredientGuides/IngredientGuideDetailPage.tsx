import Link from "next/link";
import Icon from "@/components/commons/Icon/Icon";
import type { IngredientGuideDetail } from "@/types/models";

interface IngredientGuideDetailPageProps {
  guide: IngredientGuideDetail;
}

export function IngredientGuideDetailPage({ guide }: IngredientGuideDetailPageProps) {
  const points = parseKeyPoints(guide.keyPoints);

  return (
    <div className="flex w-full flex-col px-5 pt-8 pb-10">
      <h1 className="text-center text-lg font-bold">{guide.name}</h1>
      {guide.mainIngredients && (
        <p className="mt-2 text-center text-xs text-gray-400">
          (주성분 : {guide.mainIngredients})
        </p>
      )}

      <section className="mt-8 rounded-2xl bg-green50 px-5 py-5">
        <h2 className="text-sm font-bold">핵심 포인트</h2>
        {points.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3 pl-1 text-sm leading-6">
            {points.map((point, idx) => (
              <li key={idx} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-foreground" />
                <span className="flex-1">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-6 whitespace-pre-line">
            {guide.keyPoints}
          </p>
        )}
      </section>

      {guide.sources && (
        <a
          href={guide.sources}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 self-start text-xs text-gray-400 underline"
        >
          출처 자세히 보기
        </a>
      )}

      <Link
        href={`/products?ingredient=${guide.id}`}
        className="mt-8 flex h-12 items-center justify-center gap-1 rounded-xl border border-gray100 bg-background text-sm font-semibold"
      >
        <span>
          이 성분이 포함된 제품{" "}
          <span className="text-green600">{guide.productCount}개</span> 보러가기
        </span>
        <Icon icon="IC_ArrowRight" size="sm" className="text-gray-500" />
      </Link>
    </div>
  );
}

function parseKeyPoints(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•·*]\s*/, "").trim())
    .filter((line) => line.length > 0);
}
