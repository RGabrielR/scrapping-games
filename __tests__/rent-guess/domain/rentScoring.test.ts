import { evaluateGuess, shouldCountStrike } from "@/features/rent-guess/domain/rentScoring";
import { RentResult } from "@/features/rent-guess/domain/RentResult";

const REAL_PRICE = "ARS 1.000.000";

describe("evaluateGuess", () => {
  it("EXCELLENT (+200) when within 5%", () => {
    const result = evaluateGuess(1000000, REAL_PRICE);
    expect(result.result).toBe(RentResult.EXCELLENT);
    expect(result.delta).toBe(200);
    expect(result.percentDiff).toBe(0);
  });

  it("EXCELLENT (+200) when 4.9% off", () => {
    const result = evaluateGuess(951000, REAL_PRICE); // ~4.9% off
    expect(result.result).toBe(RentResult.EXCELLENT);
    expect(result.delta).toBe(200);
  });

  it("VERY_GOOD (+100) when 10% off", () => {
    const result = evaluateGuess(900000, REAL_PRICE);
    expect(result.result).toBe(RentResult.VERY_GOOD);
    expect(result.delta).toBe(100);
  });

  it("GOOD (+50) when 20% off", () => {
    const result = evaluateGuess(800000, REAL_PRICE);
    expect(result.result).toBe(RentResult.GOOD);
    expect(result.delta).toBe(50);
  });

  it("NOT_BAD (-20) when 30% off", () => {
    const result = evaluateGuess(700000, REAL_PRICE);
    expect(result.result).toBe(RentResult.NOT_BAD);
    expect(result.delta).toBe(-20);
  });

  it("BAD (-50) when 40% off", () => {
    const result = evaluateGuess(600000, REAL_PRICE);
    expect(result.result).toBe(RentResult.BAD);
    expect(result.delta).toBe(-50);
  });

  it("VERY_BAD (-100) when 50% off", () => {
    const result = evaluateGuess(500000, REAL_PRICE);
    expect(result.result).toBe(RentResult.VERY_BAD);
    expect(result.delta).toBe(-100);
  });

  it("AWFUL (-200) when 90% off", () => {
    const result = evaluateGuess(100000, REAL_PRICE);
    expect(result.result).toBe(RentResult.AWFUL);
    expect(result.delta).toBe(-200);
  });

  it("returns percentDiff as a number", () => {
    const result = evaluateGuess(900000, REAL_PRICE);
    expect(typeof result.percentDiff).toBe("number");
    expect(result.percentDiff).toBeCloseTo(10, 0);
  });

  it("returns title and feedbackMessage for all results", () => {
    const result = evaluateGuess(1000000, REAL_PRICE);
    expect(typeof result.title).toBe("string");
    expect(typeof result.feedbackMessage).toBe("string");
    expect(result.title.length).toBeGreaterThan(0);
  });

  it("handles ARS price string formats", () => {
    expect(evaluateGuess(1000000, "ARS 1.000.000").result).toBe(
      RentResult.EXCELLENT
    );
    expect(evaluateGuess(1000000, "$ 1.000.000").result).toBe(
      RentResult.EXCELLENT
    );
  });
});

describe("shouldCountStrike", () => {
  it("returns false when percentDiff is exactly 30", () => {
    expect(shouldCountStrike(30)).toBe(false);
  });

  it("returns true when percentDiff is 30.01", () => {
    expect(shouldCountStrike(30.01)).toBe(true);
  });

  it("returns false when percentDiff is 0", () => {
    expect(shouldCountStrike(0)).toBe(false);
  });

  it("returns true when percentDiff is 100", () => {
    expect(shouldCountStrike(100)).toBe(true);
  });
});
