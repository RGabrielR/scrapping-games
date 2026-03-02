"use client";
import { useState, useEffect } from "react";
import { evaluateVote } from "../domain/votingScoring";

const RESULT_DISPLAY_MS = 3500;
const FETCH_DELAY_MS = 500;
const SCORE_TICK_MS = 10;

export const useVotingGame = () => {
  const [deputy, setDeputy] = useState(null);
  const [lastDeputy, setLastDeputy] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const loadNextDeputy = () => {
    setTimeout(() => {
      fetch("/api/results-data")
        .then((r) => r.json())
        .then(setDeputy)
        .catch((err) => console.error("Error fetching deputy:", err));
    }, FETCH_DELAY_MS);
  };

  useEffect(() => {
    loadNextDeputy();
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
   * Records the user's vote and advances the round after the result animation.
   * @param {string[]} selectedOptions - e.g. ["AFIRMATIVO"] or ["AUSENTE", "ABSTENCION"]
   */
  const vote = (selectedOptions) => {
    if (!deputy) return;
    setLastDeputy(deputy);
    const { correct, delta } = evaluateVote(selectedOptions, deputy.vote);
    setResult(correct ? "CORRECT" : "INCORRECT");
    setTargetScore(score + delta);
    setShowAnimation(true);

    setTimeout(() => {
      setResult(null);
      setDeputy(null);
      setShowAnimation(false);
      loadNextDeputy();
    }, RESULT_DISPLAY_MS);
  };

  return { deputy, lastDeputy, result, score, targetScore, showAnimation, vote };
};
