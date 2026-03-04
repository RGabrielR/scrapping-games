import type { VoteEvaluation } from "@/types";

const CORRECT_SCORE_DELTA = 100;
const INCORRECT_SCORE_DELTA = 0;

export const evaluateVote = (
  selectedOptions: string[],
  actualVote: string
): VoteEvaluation => {
  const isCorrect = selectedOptions.includes(actualVote);
  return {
    correct: isCorrect,
    delta: isCorrect ? CORRECT_SCORE_DELTA : INCORRECT_SCORE_DELTA,
  };
};
