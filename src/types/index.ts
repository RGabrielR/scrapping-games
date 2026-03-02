export interface Deputy {
  name: string;
  party: string;
  province: string;
  vote: string;
  photoLink: string | undefined;
  project: string;
  moreInfo: string;
}

export interface ApartmentData {
  arrayOfImages: string[];
  meters: string;
  location: string;
  description: string;
  prizeInARS?: string;
  prizeInUSD?: string;
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
