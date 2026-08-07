import { fetchIngredientGuides } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character]!,
  );
}

export async function GET() {
  const guides = await fetchIngredientGuides().catch(() => ({
    count: 0,
    next: null,
    previous: null,
    results: [],
  }));

  const items = guides.results
    .map((guide) => {
      const link = absoluteUrl(`/ingredients/guides/${guide.id}`);
      const title = escapeXml(guide.name);

      return [
        "    <item>",
        `      <title>${title}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${title} 성분 가이드</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>다시 성분 가이드</title>",
    `    <link>${absoluteUrl("/")}</link>`,
    "    <description>다이어트 보조제 성분 분석과 가이드</description>",
    "    <language>ko-KR</language>",
    `    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
