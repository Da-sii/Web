import { redirect } from "next/navigation";

/**
 * 카테고리 상품 목록은 앱과 동일하게 /category/list 로 통합됐다.
 * 기존 /products?main=&middle=&small= 링크(외부 유입·북마크·색인)를 보존하기 위해
 * 파라미터를 옮겨 리다이렉트만 한다. 제품 상세(/products/[id])는 그대로 유지된다.
 */
interface PageProps {
  searchParams: Promise<{
    main?: string;
    middle?: string;
    small?: string;
    sub?: string;
    sort?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = new URLSearchParams();
  if (params.main) next.set("main", params.main);
  if (params.middle) next.set("middle", params.middle);
  // 구 파라미터명 small → sub
  const sub = params.sub ?? params.small;
  if (sub) next.set("sub", sub);
  if (params.sort) next.set("sort", params.sort);

  const query = next.toString();
  redirect(query ? `/category/list?${query}` : "/category/list");
}
