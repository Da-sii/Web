import Link from "next/link";
import Icon from "@/components/commons/Icon/Icon";
import type { IngredientGuideDetail } from "@/types/models";
import { SourcesDialog } from "./SourcesDialog";

interface IngredientGuideDetailPageProps {
  guide: IngredientGuideDetail;
}

export function IngredientGuideDetailPage({ guide }: IngredientGuideDetailPageProps) {
  return (
    <div className="flex w-full flex-col px-5 pt-8 pb-10">
      <h1 className="text-center text-lg font-bold">{guide.name}</h1>
      {guide.mainIngredients && (
        <p className="mt-2 text-center text-xs text-gray-400">
          (주성분 : {guide.mainIngredients})
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-[#82E3AF]/20 bg-gradient-to-b from-[#FDFFFB] to-[#F5FDFE] px-5 py-5">
        <h2 className="text-sm font-bold">핵심 포인트</h2>
        <ul className="mt-3 flex flex-col gap-3 pl-1 text-sm leading-6">
          {guide.keyPoints.map((point, idx) => (
            <li key={idx} className="flex gap-2">
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-foreground"
              />
              <span className="flex-1">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {guide.sources.length > 0 && <SourcesDialog sources={guide.sources} />}

      <Link
        href={`/search?word=${encodeURIComponent(guide.name)}`}
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
