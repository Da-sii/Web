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

  const pubDate = new Date().toUTCString();

  const items = guides.results
    .map((guide) => {
      const link = absoluteUrl(`/ingredients/guides/${guide.id}`);
      const title = escapeXml(guide.name);

      return [
        "    <item>",
        `      <title>${title}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${title} 성분 가이드</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // atom 접두사는 <rss> 에서 선언해야 유효성 검사를 통과한다.
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>다시 성분 가이드</title>",
    `    <link>${absoluteUrl("/")}</link>`,
    "    <description>다이어트 보조제 성분 분석과 가이드</description>",
    "    <language>ko-KR</language>",
    `    <lastBuildDate>${pubDate}</lastBuildDate>`,
    `    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />`,
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
