# Leaderboard — Setup & Operations

## Overview
The leaderboard persists top-50 scores per game in a Turso (libSQL/SQLite edge) database.
Without env vars set, the system falls back gracefully — all reads return empty arrays, all writes are no-ops.

## Setup Turso

1. Create an account at https://app.turso.tech
2. Create a database (free tier works fine):
   ```bash
   turso db create scrapping-games
   ```
3. Get the URL and auth token:
   ```bash
   turso db show scrapping-games --url
   turso db tokens create scrapping-games
   ```
4. Copy `.env.example` → `.env.local` and fill in the values:
   ```
   TURSO_DATABASE_URL=libsql://scrapping-games-<org>.turso.io
   TURSO_AUTH_TOKEN=<token>
   ```

## Schema Migration

Run the following SQL once against your Turso database:

```sql
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id TEXT PRIMARY KEY,
  game TEXT NOT NULL,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  strikes INTEGER,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lb_game ON leaderboard_entries(game);
CREATE INDEX IF NOT EXISTS idx_lb_game_score ON leaderboard_entries(game, score DESC);
```

You can run it via the Turso shell:
```bash
turso db shell scrapping-games < docs/schema.sql
```

Or via the Turso UI at https://app.turso.tech.

## API Endpoints

### GET /api/leaderboard?game=como-voto
Returns top 50 entries for the specified game sorted by score descending.

**Valid game values:** `como-voto`, `cuanto-esta`

**Response:**
```json
{
  "game": "como-voto",
  "entries": [
    { "id": "uuid", "name": "Player1", "score": 500, "strikes": 1, "createdAt": "2026-01-01T00:00:00.000Z" }
  ]
}
```

### POST /api/leaderboard
Save a score if it qualifies for top 50.

**Body:**
```json
{ "game": "como-voto", "name": "Player1", "score": 500, "strikes": 2 }
```

**Response (qualified):**
```json
{ "saved": true, "qualified": true, "rank": 4 }
```

**Response (not qualified):**
```json
{ "saved": false, "qualified": false }
```

## Game IDs
| Page | Game ID |
|------|---------|
| `/como-voto` | `como-voto` |
| `/cuanto-esta` | `cuanto-esta` |

## Adding a New Game
1. Add the new game route/page.
2. Pass the new game ID string to `<GameOverModal game="new-game-id" ...>`.
3. Add the game ID to `VALID_GAMES` in `src/pages/api/leaderboard.ts`.
4. Add a tab entry in `src/pages/leaderboard.tsx` `GAMES` array.
5. No schema changes needed — the `game` column stores any string.

## Deploy (Vercel)
Set environment variables in the Vercel dashboard:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

These are server-side only and never exposed to the client.
