import { PendingLink } from "@/components/commons/NavProgress";
import Icon from "@/components/commons/Icon/Icon";
import { ingredientGuides } from "@/lib/mock-data";

export function GuideTagSection() {
  return (
    <section className="flex flex-col px-6 mb-14">
      <PendingLink
        href="/ingredients/guides"
        className="flex items-center justify-between mb-4"
      >
        <h2 className="text-lg font-extrabold">성분 가이드</h2>
        <Icon icon="IC_ArrowRight" size="sm" className="text-muted-foreground" />
      </PendingLink>
      <div className="flex flex-wrap gap-2">
        {ingredientGuides.map((guide) => (
          <PendingLink
            key={guide.id}
            href={`/ingredients/guides/${guide.id}`}
            className="rounded-full border-[0.5px] border-gray100 bg-white px-3 py-1 text-sm text-gray700"
          >
            {guide.name}
          </PendingLink>
        ))}
      </div>
    </section>
  );
}
