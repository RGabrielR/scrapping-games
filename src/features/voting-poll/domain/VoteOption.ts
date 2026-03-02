export const VoteOption = {
  AFIRMATIVO: "AFIRMATIVO",
  NEGATIVO: "NEGATIVO",
  AUSENTE: "AUSENTE",
  ABSTENCION: "ABSTENCION",
} as const;

export type VoteOptionType = (typeof VoteOption)[keyof typeof VoteOption];
