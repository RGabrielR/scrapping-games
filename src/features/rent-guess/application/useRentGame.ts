"use client";
import { useState, useEffect } from "react";
import { evaluateGuess } from "../domain/rentScoring";
import { parseFormattedNumber } from "@/shared/lib/numberFormat";
import type { ApartmentData, ApartmentWithResult } from "@/types";

const SCORE_TICK_MS = 10;
const MODAL_DELAY_MS = 2000;
const NEXT_ROUND_DELAY_MS = 2100;

const fetchApartment = (): Promise<ApartmentData> =>
  fetch("/api/random-guess").then((r) => r.json());

export const useRentGame = () => {
  const [presentApartment, setPresentApartment] = useState<ApartmentData | null>(null);
  const [nextApartment, setNextApartment] = useState<ApartmentData | null>(null);
  const [lastApartment, setLastApartment] = useState<ApartmentWithResult | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    Promise.all([fetchApartment(), fetchApartment()]).then(([present, next]) => {
      setPresentApartment(present);
      setNextApartment(next);
    });
  }, []);

  useEffect(() => {
    if (targetScore === null) return;
    const increment = targetScore > score ? 1 : -1;
    let current = score;
    const interval = setInterval(() => {
      current += increment;
      setScore(current);
      if (
        (increment === 1 && current >= targetScore) ||
        (increment === -1 && current <= targetScore)
      ) {
        setScore(targetScore);
        setTargetScore(null);
        clearInterval(interval);
      }
    }, SCORE_TICK_MS);
    return () => clearInterval(interval);
  }, [score, targetScore]);

  const submitGuess = () => {
    if (!guess || !presentApartment) return;

    const guessedPrice = parseFormattedNumber(guess);
    const { result: newResult, delta, percentDiff, title, feedbackMessage } =
      evaluateGuess(guessedPrice, presentApartment.prizeInARS ?? "");

    setResult(newResult);
    setTargetScore(score + delta);
    setLastApartment({ ...presentApartment, percentDiff, guess, title, feedbackMessage });
    setShowAnimation(true);

    setTimeout(() => {
      setShowResult(true);
      setShowAnimation(false);
      setGuess("");
    }, MODAL_DELAY_MS);

    setTimeout(() => {
      setPresentApartment(nextApartment);
      setNextApartment(null);
      fetchApartment().then(setNextApartment);
    }, NEXT_ROUND_DELAY_MS);
  };

  return {
    presentApartment,
    lastApartment,
    result,
    score,
    targetScore,
    showAnimation,
    showHint,
    setShowHint,
    showResult,
    setShowResult,
    guess,
    setGuess,
    submitGuess,
  };
};
