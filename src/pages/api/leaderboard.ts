import type { NextApiRequest, NextApiResponse } from "next";
import { getTop50, saveIfQualifies } from "@/infrastructure/db/leaderboardRepository";
import { isNicknameValid } from "@/shared/domain/leaderboard";

const VALID_GAMES = ["como-voto", "cuanto-esta"] as const;
type GameId = (typeof VALID_GAMES)[number];

const isValidGame = (value: unknown): value is GameId =>
  VALID_GAMES.includes(value as GameId);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { game } = req.query;
    if (!isValidGame(game)) {
      return res.status(400).json({ error: "Invalid game" });
    }
    const entries = await getTop50(game);
    return res.status(200).json({ game, entries });
  }

  if (req.method === "POST") {
    const { game, name, score, strikes } = req.body as {
      game: unknown;
      name: unknown;
      score: unknown;
      strikes: unknown;
    };

    if (!isValidGame(game)) {
      return res.status(400).json({ error: "Invalid game" });
    }
    if (typeof name !== "string" || !isNicknameValid(name)) {
      return res.status(400).json({ error: "Invalid name" });
    }
    if (typeof score !== "number" || score <= 0) {
      return res.status(400).json({ error: "Invalid score" });
    }

    const strikesValue = typeof strikes === "number" ? strikes : null;
    const { saved, rank } = await saveIfQualifies({
      game,
      name: name.trim(),
      score,
      strikes: strikesValue,
    });

    return res.status(200).json({ saved, qualified: saved, rank: saved ? rank : undefined });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
