export const canEnterLeaderboard = (
  score: number,
  top50: { score: number }[]
): boolean =>
  top50.length < 50 || score > Math.min(...top50.map((e) => e.score));

export const isNicknameValid = (name: string): boolean =>
  /^[\w\s-]{3,16}$/.test(name.trim());
