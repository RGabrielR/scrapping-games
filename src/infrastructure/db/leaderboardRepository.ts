import { db } from "./tursoClient";
import type { LeaderboardEntry } from "@/types";

const TOP_N = 50;

export const getTop50 = async (game: string): Promise<LeaderboardEntry[]> => {
  if (!db) return [];
  const result = await db.execute({
    sql: `SELECT id, game, name, score, strikes, created_at as createdAt
          FROM leaderboard_entries
          WHERE game = ?
          ORDER BY score DESC
          LIMIT ${TOP_N}`,
    args: [game],
  });
  return result.rows.map((r) => ({
    id: r.id as string,
    game: r.game as string,
    name: r.name as string,
    score: r.score as number,
    strikes: r.strikes as number | null,
    createdAt: r.createdAt as string,
  }));
};

export const saveIfQualifies = async (entry: {
  game: string;
  name: string;
  score: number;
  strikes: number | null;
}): Promise<{ saved: boolean; rank: number }> => {
  if (!db) return { saved: false, rank: 0 };

  const top = await getTop50(entry.game);

  const qualifies =
    top.length < TOP_N ||
    entry.score > Math.min(...top.map((e) => e.score));

  if (!qualifies) return { saved: false, rank: 0 };

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO leaderboard_entries (id, game, name, score, strikes, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, entry.game, entry.name, entry.score, entry.strikes ?? null, createdAt],
  });

  // If we now exceed TOP_N, delete the worst entry
  if (top.length >= TOP_N) {
    const worst = top[top.length - 1];
    await db.execute({
      sql: `DELETE FROM leaderboard_entries WHERE id = ?`,
      args: [worst.id],
    });
  }

  // Recalculate rank
  const updated = await getTop50(entry.game);
  const rank = updated.findIndex((e) => e.id === id) + 1;

  return { saved: true, rank };
};
