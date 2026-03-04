export interface Deputy {
  name: string;
  party: string;
  province: string;
  vote: string;
  photoLink: string | undefined;
  project: string;
  moreInfo: string;
  chamber: "diputados" | "senadores";
}

export interface ApartmentData {
  arrayOfImages: string[];
  meters: string;
  location: string;
  description: string;
  prizeInARS?: string;
  prizeInUSD?: string;
  city?: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  expenses?: string;
}

export interface ApartmentWithResult extends ApartmentData {
  title: string;
  feedbackMessage: string;
  percentDiff: number;
  guess: string;
}

export interface VoteEvaluation {
  correct: boolean;
  delta: number;
}

export interface RentEvaluation {
  result: string;
  delta: number;
  percentDiff: number;
  title: string;
  feedbackMessage: string;
}

export interface LeaderboardEntry {
  id: string;
  game: string;
  name: string;
  score: number;
  strikes: number | null;
  createdAt: string;
}

export interface SaveScoreResult {
  saved: boolean;
  qualified: boolean;
  rank?: number;
}
