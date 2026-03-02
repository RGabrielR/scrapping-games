const CORRECT_SCORE_DELTA = 100;
const INCORRECT_SCORE_DELTA = -20;

/**
 * Evaluates whether the user's selected vote options match the deputy's actual vote.
 * @param {string[]} selectedOptions - e.g. ["AUSENTE", "ABSTENCION"]
 * @param {string} actualVote - The deputy's recorded vote
 * @returns {{ correct: boolean, delta: number }}
 */
export const evaluateVote = (selectedOptions, actualVote) => {
  const isCorrect = selectedOptions.includes(actualVote);
  return {
    correct: isCorrect,
    delta: isCorrect ? CORRECT_SCORE_DELTA : INCORRECT_SCORE_DELTA,
  };
};
