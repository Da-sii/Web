import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ingredientGuides } from "@/lib/mock-data";

export function GuideTagSection() {
  return (
    <section className="flex flex-col gap-3 py-4">
      <Link
        href="/ingredients/guides"
        className="flex items-center justify-between px-4"
      >
        <h2 className="text-base font-bold">성분 가이드</h2>
        <ChevronRight className="size-5 text-muted-foreground" />
      </Link>
      <div className="flex flex-wrap gap-2 px-4">
        {ingredientGuides.map((guide) => (
          <Link
            key={guide.id}
            href={`/ingredients/guides/${guide.id}`}
            className="rounded-full border bg-background px-3 py-1.5 text-sm hover:bg-accent"
          >
            #{guide.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
