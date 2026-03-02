"use client";
import { useState, useEffect } from "react";
import { evaluateVote } from "../domain/votingScoring";

const RESULT_DISPLAY_MS = 3500;
const FETCH_DELAY_MS = 500;
const SCORE_TICK_MS = 10;
// Minimum time the loading/info screen stays visible after a vote,
// so the user has time to read the last deputy's result.
const MIN_LOADING_DISPLAY_MS = 2500;

export const useVotingGame = () => {
  const [deputy, setDeputy] = useState(null);
  const [lastDeputy, setLastDeputy] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  /**
   * Fetches the next deputy and shows it only after MIN_LOADING_DISPLAY_MS
   * has elapsed since the loading screen appeared.
   * @param {number} loadingStartedAt - timestamp when the loading screen became visible.
   *   Defaults to "already past minimum" so the initial load shows immediately.
   */
  const loadNextDeputy = (loadingStartedAt = Date.now() - MIN_LOADING_DISPLAY_MS) => {
    setTimeout(() => {
      fetch("/api/results-data")
        .then((r) => r.json())
        .then((data) => {
          const elapsed = Date.now() - loadingStartedAt;
          const remaining = Math.max(0, MIN_LOADING_DISPLAY_MS - elapsed);
          setTimeout(() => setDeputy(data), remaining);
        })
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
      loadNextDeputy(Date.now()); // loading screen starts now
    }, RESULT_DISPLAY_MS);
  };

  return { deputy, lastDeputy, result, score, targetScore, showAnimation, vote };
};
