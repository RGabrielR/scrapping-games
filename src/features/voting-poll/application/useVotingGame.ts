"use client";
import { useState, useEffect } from "react";
import { evaluateVote } from "../domain/votingScoring";
import type { Deputy } from "@/types";

const RESULT_DISPLAY_MS = 3500;
const FETCH_DELAY_MS = 500;
const SCORE_TICK_MS = 10;
const MIN_LOADING_DISPLAY_MS = 2500;
const FETCH_TIMEOUT_MS = 12000;

export const useVotingGame = () => {
  const [deputy, setDeputy] = useState<Deputy | null>(null);
  const [lastDeputy, setLastDeputy] = useState<Deputy | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const loadNextDeputy = (loadingStartedAt = Date.now() - MIN_LOADING_DISPLAY_MS) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    setTimeout(() => {
      fetch("/api/results-data", { signal: controller.signal })
        .then((r) => r.json())
        .then((data: Deputy) => {
          clearTimeout(timeoutId);
          const elapsed = Date.now() - loadingStartedAt;
          const remaining = Math.max(0, MIN_LOADING_DISPLAY_MS - elapsed);
          setTimeout(() => setDeputy(data), remaining);
        })
        .catch((err: unknown) => {
          clearTimeout(timeoutId);
          console.error("Error fetching deputy:", err);
          setFetchError(true);
        });
    }, FETCH_DELAY_MS);
  };

  useEffect(() => {
    loadNextDeputy();
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

  const vote = (selectedOptions: string[]) => {
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
      loadNextDeputy(Date.now());
    }, RESULT_DISPLAY_MS);
  };

  const retry = () => {
    setFetchError(false);
    loadNextDeputy();
  };

  return { deputy, lastDeputy, result, score, targetScore, showAnimation, fetchError, retry, vote };
};
