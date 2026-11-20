export const DAISO_BIG_CATEGORY = "다이소 제품";
export const DAISO_PREVIEW_COUNT = 10;

export function normalizeSearchKeyword(word: string): string {
  const trimmed = word.trim();
  return ["다이소", "다이소몰", "다이소제품", "daiso", "daisomall"].includes(
    trimmed.replace(/\s/g, "").toLowerCase(),
  ) ? "다이소" : trimmed;
}
