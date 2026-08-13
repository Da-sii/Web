export const parseNumeric = (s: string | null | undefined): number => {
  const cleaned = (s ?? "").replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

/** 마이크로 기호(μ: 그리스 문자 / µ: micro sign) */
export const MICRO_CHAR_PATTERN = /([μµ])/;

export interface SplitValue {
  /** 앞머리 숫자. 숫자로 시작하지 않으면 null */
  number: number | null;
  /** 원문에 숫자와 단위 사이 공백이 있었는지 ("" 또는 " ") */
  gap: string;
  /** 숫자를 제외한 나머지. number가 null이면 원문 전체 */
  unit: string;
}

/**
 * "1000mg"   → { number: 1000, gap: "",  unit: "mg" }
 * "5억 CFU"  → { number: 5,    gap: " ", unit: "억 CFU" }  (한글 단위 유지)
 * "-"        → { number: null, gap: "",  unit: "-" }       (원문 그대로 노출)
 */
export function splitValue(raw: string | null | undefined): SplitValue {
  const s = (raw ?? "").trim();
  const match = s.match(/^([\d,]*\.?\d+)(\s*)(.*)$/);
  if (!match) return { number: null, gap: "", unit: s };
  const number = parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(number)) return { number: null, gap: "", unit: s };
  return { number, gap: match[2] ? " " : "", unit: match[3].trim() };
}

/** 천 단위 구분 + 단위 보존한 문자열. 마크업이 필요하면 <FormattedAmount /> 를 쓸 것. */
export const formatNumber = (s: string | null | undefined): string => {
  const { number, gap, unit } = splitValue(s);
  if (number === null) return unit;
  return `${number.toLocaleString("ko-KR")}${gap}${unit}`;
};

/** μg 기준 배수. 여기에 없는 단위(IU, %, 억 CFU, mL …)는 서로 환산할 수 없다. */
const MASS_UNIT_TO_MICROGRAM: Record<string, number> = {
  g: 1_000_000,
  mg: 1_000,
  μg: 1,
  µg: 1,
  mcg: 1,
  ug: 1,
};

export interface NormalizedAmount {
  value: number;
  /** 알려진 질량 단위로 환산됐는지. false면 다른 값과 직접 비교할 수 없다. */
  known: boolean;
}

/**
 * 값을 μg 기준으로 정규화한다.
 * 질량 단위가 아니면 `known: false`와 함께 원시 숫자를 돌려주므로,
 * 호출부는 단위가 같은 값끼리만 비교해야 한다.
 */
export function toMicrograms(s: string | null | undefined): NormalizedAmount {
  const { number, unit } = splitValue(s);
  const value = number ?? 0;
  const symbol = unit.match(/^[a-zA-Zμµ]+/)?.[0] ?? "";
  const factor = MASS_UNIT_TO_MICROGRAM[symbol] ?? MASS_UNIT_TO_MICROGRAM[symbol.toLowerCase()];
  if (factor === undefined) return { value, known: false };
  return { value: value * factor, known: true };
}

/**
 * 두 값을 비교 가능한 스칼라 쌍으로 바꾼다.
 * 양쪽 모두 질량 단위일 때만 μg로 환산하고, 아니면 원시 숫자끼리 비교한다.
 * (유산균 "5억 CFU"를 5μg로 취급해 비율이 무의미해지는 것을 막는다.)
 */
function comparablePair(
  a: string | null | undefined,
  b: string | null | undefined,
): [number, number] {
  const left = toMicrograms(a);
  const right = toMicrograms(b);
  if (left.known && right.known) return [left.value, right.value];
  return [splitValue(a).number ?? 0, splitValue(b).number ?? 0];
}

export type IngredientStatus = "초과" | "적정" | "미만";

export function computeStatus(
  amount: string,
  minRecommended: string,
  maxRecommended: string,
): IngredientStatus {
  const [a, max] = comparablePair(amount, maxRecommended);
  if (a > max) return "초과";
  const [a2, min] = comparablePair(amount, minRecommended);
  if (a2 < min) return "미만";
  return "적정";
}

/** 도넛 게이지 채움 비율 (0~1) */
export function computeFillRatio(
  amount: string,
  maxRecommended: string,
  status: IngredientStatus,
): number {
  if (status === "초과") return 1;
  const [a, max] = comparablePair(amount, maxRecommended);
  if (max <= 0) return 0;
  return Math.min(a / max, 1);
}
