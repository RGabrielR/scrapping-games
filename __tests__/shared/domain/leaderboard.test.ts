import { canEnterLeaderboard, isNicknameValid } from "@/shared/domain/leaderboard";

const makeEntries = (scores: number[]) => scores.map((score) => ({ score }));

describe("canEnterLeaderboard", () => {
  it("qualifies when top50 has fewer than 50 entries", () => {
    expect(canEnterLeaderboard(1, makeEntries([100, 200]))).toBe(true);
  });

  it("qualifies when score is greater than worst in full top 50", () => {
    const top50 = makeEntries(Array.from({ length: 50 }, (_, i) => (i + 1) * 10));
    expect(canEnterLeaderboard(501, top50)).toBe(true);
  });

  it("does not qualify when score equals worst in full top 50", () => {
    const top50 = makeEntries(Array.from({ length: 50 }, (_, i) => (i + 1) * 10));
    // worst is 10
    expect(canEnterLeaderboard(10, top50)).toBe(false);
  });

  it("does not qualify when score is less than worst in full top 50", () => {
    const top50 = makeEntries(Array.from({ length: 50 }, (_, i) => (i + 1) * 10));
    expect(canEnterLeaderboard(5, top50)).toBe(false);
  });

  it("qualifies when top50 is empty", () => {
    expect(canEnterLeaderboard(0, [])).toBe(true);
  });
});

describe("isNicknameValid", () => {
  it("accepts exactly 3 characters", () => {
    expect(isNicknameValid("abc")).toBe(true);
  });

  it("accepts exactly 16 characters", () => {
    expect(isNicknameValid("abcdefghijklmnop")).toBe(true);
  });

  it("rejects fewer than 3 characters", () => {
    expect(isNicknameValid("ab")).toBe(false);
    expect(isNicknameValid("")).toBe(false);
  });

  it("rejects more than 16 characters", () => {
    expect(isNicknameValid("abcdefghijklmnopq")).toBe(false);
  });

  it("accepts letters, digits, spaces and hyphens", () => {
    expect(isNicknameValid("Ivan-123")).toBe(true);
    expect(isNicknameValid("El Gato")).toBe(true);
  });

  it("rejects special characters", () => {
    expect(isNicknameValid("foo@bar")).toBe(false);
    expect(isNicknameValid("hi!")).toBe(false);
    expect(isNicknameValid("a.b")).toBe(false);
  });

  it("trims leading/trailing spaces before validating length", () => {
    // "  ab  " trims to "ab" which is < 3 chars
    expect(isNicknameValid("  ab  ")).toBe(false);
  });
});
