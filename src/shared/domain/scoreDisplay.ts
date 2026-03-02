interface ScoreColorParams {
  score: number;
  targetScore: number | null;
}

export const scoreColor = ({ score, targetScore }: ScoreColorParams): string => {
  if (targetScore !== null) {
    return targetScore > score ? "#16a34a" : "#dc2626";
  }
  return "black";
};
