import { describe, expect, test } from "vitest";
import {
  computeFillRatio,
  computeStatus,
  formatNumber,
  splitValue,
  toMicrograms,
} from "@/lib/format";

describe("splitValue", () => {
  test("숫자와 단위를 분리한다", () => {
    expect(splitValue("1000mg")).toEqual({
      number: 1000,
      gap: "",
      unit: "mg",
    });
  });

  test("숫자와 단위 사이 공백을 보존한다", () => {
    expect(splitValue("5 억 CFU")).toEqual({
      number: 5,
      gap: " ",
      unit: "억 CFU",
    });
  });

  test("한글 단위를 유지한다", () => {
    expect(splitValue("5억 CFU")).toEqual({
      number: 5,
      gap: "",
      unit: "억 CFU",
    });
  });

  test("천 단위 콤마가 있어도 파싱한다", () => {
    expect(splitValue("1,250mg").number).toBe(1250);
  });

  test("소수를 파싱한다", () => {
    expect(splitValue("12.5μg")).toEqual({
      number: 12.5,
      gap: "",
      unit: "μg",
    });
  });

  test("숫자로 시작하지 않으면 원문을 그대로 둔다", () => {
    expect(splitValue("-")).toEqual({ number: null, gap: "", unit: "-" });
    expect(splitValue("해당없음").number).toBeNull();
  });

  test("null/undefined/빈 값을 견딘다", () => {
    expect(splitValue(null)).toEqual({ number: null, gap: "", unit: "" });
    expect(splitValue(undefined).number).toBeNull();
  });
});

describe("formatNumber", () => {
  test("천 단위를 구분하고 단위를 붙인다", () => {
    expect(formatNumber("1000mg")).toBe("1,000mg");
  });

  test("한글 단위를 잃지 않는다", () => {
    expect(formatNumber("5억 CFU")).toBe("5억 CFU");
  });

  test("마이크로 단위를 유지한다", () => {
    expect(formatNumber("12.5μg")).toBe("12.5μg");
  });

  test("공백 유무를 원문대로 재현한다", () => {
    expect(formatNumber("500 mg")).toBe("500 mg");
  });

  test("숫자가 없으면 원문을 반환한다", () => {
    expect(formatNumber("-")).toBe("-");
  });
});

describe("toMicrograms", () => {
  test("질량 단위를 μg로 환산한다", () => {
    expect(toMicrograms("2g")).toEqual({ value: 2_000_000, known: true });
    expect(toMicrograms("500mg")).toEqual({ value: 500_000, known: true });
    expect(toMicrograms("12μg")).toEqual({ value: 12, known: true });
    expect(toMicrograms("12mcg")).toEqual({ value: 12, known: true });
  });

  test("모르는 단위는 환산하지 않고 known=false 로 표시한다", () => {
    expect(toMicrograms("5억 CFU")).toEqual({ value: 5, known: false });
    expect(toMicrograms("400IU")).toEqual({ value: 400, known: false });
  });
});

describe("computeStatus", () => {
  test("단위가 달라도 질량이면 정규화해서 비교한다", () => {
    // 2g = 2,000mg → 1,000mg 상한 초과
    expect(computeStatus("2g", "100mg", "1000mg")).toBe("초과");
    expect(computeStatus("500mg", "100mg", "1000mg")).toBe("적정");
    expect(computeStatus("50mg", "100mg", "1000mg")).toBe("미만");
  });

  test("질량이 아닌 단위는 원시 숫자끼리 비교한다", () => {
    // 5억 CFU 를 5μg 로 취급하면 항상 '미만'이 되어버린다.
    expect(computeStatus("5억 CFU", "1억 CFU", "10억 CFU")).toBe("적정");
    expect(computeStatus("50억 CFU", "1억 CFU", "10억 CFU")).toBe("초과");
  });
});

describe("computeFillRatio", () => {
  test("초과면 가득 채운다", () => {
    expect(computeFillRatio("2g", "1000mg", "초과")).toBe(1);
  });

  test("질량 단위를 정규화해 비율을 낸다", () => {
    expect(computeFillRatio("500mg", "1g", "적정")).toBe(0.5);
  });

  test("비질량 단위도 같은 단위면 올바른 비율을 낸다", () => {
    expect(computeFillRatio("5억 CFU", "10억 CFU", "적정")).toBe(0.5);
  });

  test("상한이 0이면 0을 돌려준다", () => {
    expect(computeFillRatio("500mg", "-", "적정")).toBe(0);
  });
});
