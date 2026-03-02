/**
 * Returns the CSS color for the score display based on the direction of change.
 * @param {{ score: number, targetScore: number | null }} params
 * @returns {string}
 */
export const scoreColor = ({ score, targetScore }) => {
  if (targetScore !== null) {
    return targetScore > score ? "#16a34a" : "#dc2626";
  }
  return "black";
};
