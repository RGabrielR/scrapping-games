"use client";
import { useState, useEffect, useRef } from "react";
import { evaluateVote } from "../domain/votingScoring";
import type { Deputy } from "@/types";

const SCORE_TICK_MS = 10;
const MIN_LOADING_DISPLAY_MS = 2000;
const FETCH_TIMEOUT_MS = 12000;

const isValidDeputyPayload = (value: unknown): value is Deputy => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Deputy;
  const hasValidChamber =
    candidate.chamber === "diputados" || candidate.chamber === "senadores";

  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.project === "string" &&
    candidate.project.trim().length > 0 &&
    typeof candidate.vote === "string" &&
    candidate.vote.trim().length > 0 &&
    hasValidChamber
  );
};

export const useVotingGame = () => {
  const [deputy, setDeputy] = useState<Deputy | null>(null);
  const [lastDeputy, setLastDeputy] = useState<Deputy | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // pendingDeputyRef: holds the fetched deputy while waiting for the loader to appear.
  // loadingStartRef: timestamp of when the loader became visible (set in handleAnimationEnd / retry).
  // Both refs are needed so that whichever of the two events (fetch completion vs loader appearance)
  // happens last can trigger the minimum-wait timer correctly.
  const pendingDeputyRef = useRef<Deputy | null>(null);
  const loadingStartRef = useRef<number | null>(null);

  // Attempts to show the pending deputy respecting MIN_LOADING_DISPLAY_MS.
  // Called by both the fetch completion handler and handleAnimationEnd,
  // so whichever arrives second will actually schedule the state update.
  const tryShowPendingDeputy = () => {
    const data = pendingDeputyRef.current;
    const start = loadingStartRef.current;
    if (!data || start === null) return;

    pendingDeputyRef.current = null;
    loadingStartRef.current = null;
    const remaining = Math.max(0, MIN_LOADING_DISPLAY_MS - (Date.now() - start));
    setTimeout(() => {
      setDeputy(data);
      setFetchError(false);
    }, remaining);
  };

  const fetchNextDeputy = (onSuccess: (data: Deputy) => void) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    fetch("/api/results-data", { signal: controller.signal })
      .then(async (r) => {
        const payload: unknown = await r.json();
        if (!r.ok) {
          const errorMessage =
            payload &&
            typeof payload === "object" &&
            "error" in payload &&
            typeof (payload as { error?: unknown }).error === "string"
              ? (payload as { error: string }).error
              : "Failed to fetch voting data";
          throw new Error(errorMessage);
        }
        if (!isValidDeputyPayload(payload)) {
          throw new Error("Invalid deputy payload");
        }
        return payload;
      })
      .then((data: Deputy) => {
        clearTimeout(timeoutId);
        onSuccess(data);
      })
      .catch((err: unknown) => {
        clearTimeout(timeoutId);
        console.error("Error fetching deputy:", err);
        setDeputy(null);
        setFetchError(true);
      });
  };

  useEffect(() => {
    // Initial load: show as soon as data arrives, no minimum wait.
    fetchNextDeputy((data) => {
      setDeputy(data);
      setFetchError(false);
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

  const vote = (selectedOptions: string[]) => {
    if (!deputy) return;
    setLastDeputy(deputy);
    const { correct, delta } = evaluateVote(selectedOptions, deputy.vote);
    setResult(correct ? "CORRECT" : "INCORRECT");
    setTargetScore(score + delta);
    setShowAnimation(true);
    // Fetch runs in parallel with the animation so the data is ready
    // (or nearly ready) by the time the loader appears.
    fetchNextDeputy((data) => {
      pendingDeputyRef.current = data;
      tryShowPendingDeputy();
    });
  };

  const handleAnimationEnd = () => {
    setResult(null);
    setDeputy(null);
    setShowAnimation(false);
    // Mark the moment the loader becomes visible and attempt to show
    // the pending deputy (if the fetch already finished).
    loadingStartRef.current = Date.now();
    tryShowPendingDeputy();
  };

  const retry = () => {
    setFetchError(false);
    loadingStartRef.current = Date.now();
    fetchNextDeputy((data) => {
      pendingDeputyRef.current = data;
      tryShowPendingDeputy();
    });
  };

  return { deputy, lastDeputy, result, score, targetScore, showAnimation, fetchError, retry, vote, handleAnimationEnd };
};
