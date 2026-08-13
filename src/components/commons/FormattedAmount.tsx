import { MICRO_CHAR_PATTERN, splitValue } from "@/lib/format";
import { cn } from "@/lib/utils";

interface FormattedAmountProps {
  /** API가 주는 원문 값. 예: "1000mg", "5억 CFU", "12.5μg" */
  value: string | null | undefined;
  className?: string;
  /** μ 글리프에만 얹을 추가 클래스 (굵기 미세 조정용) */
  microClassName?: string;
}

/**
 * 수치와 단위를 함께 렌더한다.
 * - 숫자는 천 단위로 구분하고 단위(mg, μg, 억 CFU …)는 원문 그대로 보존한다.
 * - NanumSquareNeo에는 μ 글리프가 없어 브라우저가 다른 글꼴로 폴백하면서
 *   주변 글자보다 굵고 크게 보인다. μ만 시스템 폰트로 분리해 굵기를 맞춘다.
 */
export function FormattedAmount({
  value,
  className,
  microClassName,
}: FormattedAmountProps) {
  const { number, gap, unit } = splitValue(value);

  if (number === null) {
    return <span className={className}>{unit}</span>;
  }

  return (
    <span className={className}>
      {number.toLocaleString("ko-KR")}
      {gap}
      {unit.split(MICRO_CHAR_PATTERN).map((part, idx) =>
        MICRO_CHAR_PATTERN.test(part) ? (
          <span key={idx} className={cn("micro-unit", microClassName)}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}
