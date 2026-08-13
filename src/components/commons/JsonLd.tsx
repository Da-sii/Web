/**
 * schema.org 구조화 데이터를 삽입한다.
 * 값은 전부 서버에서 만든 객체이므로 `<` 만 이스케이프해 스크립트 조기 종료를 막는다.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
