"use client";
import { useState, useEffect } from "react";
import { evaluateGuess } from "../domain/rentScoring";
import { parseFormattedNumber } from "@/shared/lib/numberFormat";

const SCORE_TICK_MS = 10;
const MODAL_DELAY_MS = 2000;
const NEXT_ROUND_DELAY_MS = 2100;

const fetchApartment = () =>
  fetch("/api/random-guess").then((r) => r.json());

export const useRentGame = () => {
  const [presentApartment, setPresentApartment] = useState(null);
  const [nextApartment, setNextApartment] = useState(null);
  const [lastApartment, setLastApartment] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [guess, setGuess] = useState("");

  // Pre-fetch present and next apartments on mount
  useEffect(() => {
    Promise.all([fetchApartment(), fetchApartment()]).then(([present, next]) => {
      setPresentApartment(present);
      setNextApartment(next);
    });
  }, []);

  // Score counter animation
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

  /**
   * Evaluates the current guess and advances to the next round.
   */
  const submitGuess = () => {
    if (!guess || !presentApartment) return;

    const guessedPrice = parseFormattedNumber(guess);
    const { result: newResult, delta, percentDiff, title, feedbackMessage } =
      evaluateGuess(guessedPrice, presentApartment.prizeInARS);

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
