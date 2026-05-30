export const parseNumeric = (s: string | null | undefined): number => {
  const cleaned = (s ?? "").replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

export const formatNumber = (s: string | null | undefined): string =>
  parseNumeric(s).toLocaleString("ko-KR");

export function toMicrograms(s: string | null | undefined): number {
  const value = parseNumeric(s);
  const unit = ((s ?? "").match(/[a-zA-Zμ]+/)?.[0] ?? "").toLowerCase();
  if (unit === "g") return value * 1_000_000;
  if (unit === "mg") return value * 1_000;
  if (unit === "μg" || unit === "mcg" || unit === "ug") return value;
  return value;
}

export type IngredientStatus = "초과" | "적정" | "미만";

export function computeStatus(
  amount: string,
  minRecommended: string,
  maxRecommended: string,
): IngredientStatus {
  const a = toMicrograms(amount);
  const min = toMicrograms(minRecommended);
  const max = toMicrograms(maxRecommended);
  if (a > max) return "초과";
  if (a < min) return "미만";
  return "적정";
}
