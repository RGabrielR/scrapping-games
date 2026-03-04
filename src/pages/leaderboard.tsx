"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBurguer from "@/components/NavBurguer/NavBurguer";
import type { LeaderboardEntry } from "@/types";
import "tailwindcss/tailwind.css";
import "@/app/globals.scss";

type GameId = "como-voto" | "cuanto-esta";

const GAMES: { id: GameId; label: string; href: string }[] = [
  { id: "como-voto", label: "¿Cómo votó?", href: "/como-voto" },
  { id: "cuanto-esta", label: "¿Cuánto está?", href: "/cuanto-esta" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });

const LeaderboardPage = () => {
  const router = useRouter();
  const gameParam = router.query.game as GameId | undefined;
  const [activeGame, setActiveGame] = useState<GameId>("como-voto");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameParam && (gameParam === "como-voto" || gameParam === "cuanto-esta")) {
      setActiveGame(gameParam);
    }
  }, [gameParam]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?game=${activeGame}`)
      .then((r) => r.json())
      .then((data: { entries: LeaderboardEntry[] }) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [activeGame]);

  const currentGame = GAMES.find((g) => g.id === activeGame)!;

  return (
    <div
      className="voting-editorial-theme relative flex min-h-screen w-full flex-col overflow-hidden"
      style={{ fontFamily: "fontForProject, 'Avenir Next', 'Poppins', sans-serif" }}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c084fc]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#60a5fa]/25 blur-3xl" />

      <NavBurguer />

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-12 pt-20 sm:px-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ranking top 50
          </h1>
          <p className="mt-1 text-sm text-slate-500">Los mejores puntajes de cada juego</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                router.replace({ query: { game: g.id } }, undefined, { shallow: true });
              }}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeGame === g.id
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-[#f8fafc]/95 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              Cargando…
            </div>
          ) : entries.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              Todavía no hay entradas. ¡Sé el primero!
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3 text-right">Puntaje</th>
                  <th className="hidden px-5 py-3 text-right sm:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-slate-100 last:border-0 ${
                      idx === 0
                        ? "bg-amber-50/60"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/50"
                    }`}
                  >
                    <td className="px-5 py-3 font-extrabold text-slate-400">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-800">{entry.name}</td>
                    <td className="px-5 py-3 text-right font-extrabold text-slate-900">{entry.score}</td>
                    <td className="hidden px-5 py-3 text-right text-slate-400 sm:table-cell">
                      {formatDate(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back to game */}
        <div className="flex justify-center">
          <a
            href={currentGame.href}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Volver a jugar →
          </a>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
