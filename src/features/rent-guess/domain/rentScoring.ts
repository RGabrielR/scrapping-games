import { RentResult } from "./RentResult";
import type { RentEvaluation } from "@/types";

interface ScoringEntry {
  maxPercentDiff: number;
  result: string;
  delta: number;
  title: string;
  feedbackMessage: string;
}

const SCORING_TABLE: ScoringEntry[] = [
  {
    maxPercentDiff: 5,
    result: RentResult.EXCELLENT,
    delta: 200,
    title: "EXCELENTE",
    feedbackMessage: "Le acertaste perfecto! sigue así! :D :D :D",
  },
  {
    maxPercentDiff: 15,
    result: RentResult.VERY_GOOD,
    delta: 100,
    title: "MUY BUENO",
    feedbackMessage: "Le acertaste bastante! Excelente trabajo :)",
  },
  {
    maxPercentDiff: 25,
    result: RentResult.GOOD,
    delta: 50,
    title: "CERCA...",
    feedbackMessage: "Rondaste el precio pero podes hacerlo mejor ;)",
  },
  {
    maxPercentDiff: 35,
    result: RentResult.NOT_BAD,
    delta: -20,
    title: "MMM... ALGO LEJOS",
    feedbackMessage: "Quedaste lejos del precio :/",
  },
  {
    maxPercentDiff: 45,
    result: RentResult.BAD,
    delta: -50,
    title: "LEJOS",
    feedbackMessage:
      "Quizas el precio esta mal, o tu intuición, pero no estuvieron cerca ninguno de los dos",
  },
  {
    maxPercentDiff: 55,
    result: RentResult.VERY_BAD,
    delta: -100,
    title: "MUY LEJOS",
    feedbackMessage: "En esta ocasión quedaste bastante lejos del precio",
  },
  {
    maxPercentDiff: Infinity,
    result: RentResult.AWFUL,
    delta: -200,
    title: "NI DE CERCA...",
    feedbackMessage:
      "El precio del alquiler y lo que vos pensaste que es distan mucho mucho mucho :( :(",
  },
];

const parseArsPrice = (priceString: string): number =>
  parseFloat(
    priceString.replace("ARS ", "").replace("$ ", "").replaceAll(".", "")
  );

export const evaluateGuess = (
  guessedPrice: number,
  realPriceARS: string
): RentEvaluation => {
  const realPrice = parseArsPrice(realPriceARS);
  const percentDiff = Math.abs((100 * guessedPrice) / realPrice - 100);
  const range = SCORING_TABLE.find((r) => percentDiff < r.maxPercentDiff)!;
  return {
    result: range.result,
    delta: range.delta,
    percentDiff,
    title: range.title,
    feedbackMessage: range.feedbackMessage,
  };
};
