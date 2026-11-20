import { describe, expect, it } from "vitest";
import { buildSurveyPayload, questions } from "@/lib/recommendation";

describe("recommendation survey", () => {
  it("maps all nine answers to the existing API contract", () => {
    expect(buildSurveyPayload({
      1: ["체지방 감소", "피로 회복"], 2: "60대 이상", 3: "선택 안 함",
      4: "주 1~2회", 5: "예민한 편", 6: "5~7시간",
      7: "다이어트 중 (식이 제한)", 8: "주 3회 이상", 9: "금연 중",
    })).toEqual({
      goals: ["체지방 감소", "피로 회복"], age_range: "60s+", gender: "N",
      exercise_frequency: "1_2", caffeine_sensitivity: "sensitive", sleep_hours: "5_7",
      meal_regularity: "diet", alcohol_frequency: "3_plus", smoking_status: "quitting",
    });
  });
  it("maps every offered coded answer", () => {
    const base = Object.fromEntries(questions.map(q => [q.id, q.multiple ? [q.options[0]] : q.options[0]]));
    for (const question of questions.slice(1)) {
      for (const answer of question.options) {
        const payload = buildSurveyPayload({ ...base, [question.id]: answer });
        expect(Object.values(payload).every(value => value !== undefined)).toBe(true);
      }
    }
  });
});
