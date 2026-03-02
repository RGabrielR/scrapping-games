export const RentResult = {
  EXCELLENT: "EXCELLENT",
  VERY_GOOD: "VERY-GOOD",
  GOOD: "GOOD",
  NOT_BAD: "NOT-BAD",
  BAD: "BAD",
  VERY_BAD: "VERY-BAD",
  AWFUL: "AWFUL",
} as const;

export type RentResultType = (typeof RentResult)[keyof typeof RentResult];
