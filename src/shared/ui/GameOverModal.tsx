import { useState, useEffect } from "react";
import { canEnterLeaderboard, isNicknameValid } from "@/shared/domain/leaderboard";
import type { LeaderboardEntry, SaveScoreResult } from "@/types";

interface GameOverModalProps {
  show: boolean;
  game: "como-voto" | "cuanto-esta";
  score: number;
  strikes: number;
  onRetry: () => void;
}

const GameOverModal = ({ show, game, score, strikes, onRetry }: GameOverModalProps) => {
  const [top50, setTop50] = useState<LeaderboardEntry[]>([]);
  const [nickname, setNickname] = useState("");
  const [saveResult, setSaveResult] = useState<SaveScoreResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    if (!show) {
      setTop50([]);
      setNickname("");
      setSaveResult(null);
      setSaving(false);
      setNicknameError("");
      return;
    }
    fetch(`/api/leaderboard?game=${game}`)
      .then((r) => r.json())
      .then((data: { entries: LeaderboardEntry[] }) => setTop50(data.entries ?? []))
      .catch(() => setTop50([]));
  }, [show, game]);

  if (!show) return null;

  const eligible = score > 0 && canEnterLeaderboard(score, top50);

  const handleSave = async () => {
    if (!isNicknameValid(nickname)) {
      setNicknameError("El nombre debe tener entre 3 y 16 caracteres (letras, números, espacios o guiones).");
      return;
    }
    setNicknameError("");
    setSaving(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, name: nickname.trim(), score, strikes }),
      });
      const data: SaveScoreResult = await res.json();
      setSaveResult(data);
    } catch {
      setSaveResult({ saved: false, qualified: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div
        className="fade-in relative flex w-full max-w-md flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f8fafc] shadow-[0_32px_80px_rgba(15,23,42,0.35)]"
        style={{ maxHeight: "85vh" }}
      >
        {/* Red top strip */}
        <div className="h-2 w-full flex-none bg-rose-400" />

        {/* Header */}
        <div className="flex flex-none flex-col items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-6 py-5 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl">
            💀
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Game Over</h2>
          <p className="text-sm text-slate-500">Llegaste a 3 strikes</p>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          {/* Score + strikes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Puntaje final</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-800">{score}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">Strikes</p>
              <p className="mt-1 text-2xl font-extrabold text-rose-600">{strikes}/3</p>
            </div>
          </div>

          {/* Leaderboard section */}
          {eligible && !saveResult && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-4">
              <p className="mb-3 text-sm font-bold text-emerald-700">¡Entraste al top 50! Guardá tu puntaje:</p>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="Tu nombre (3–16 caracteres)"
                maxLength={20}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-400"
              />
              {nicknameError && (
                <p className="mt-1.5 text-xs text-rose-600">{nicknameError}</p>
              )}
              <button
                onClick={handleSave}
                disabled={saving || nickname.trim().length < 3}
                className={`mt-3 w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition ${
                  saving || nickname.trim().length < 3
                    ? "cursor-not-allowed bg-slate-300"
                    : "bg-emerald-600 hover:-translate-y-0.5 hover:bg-emerald-700"
                }`}
              >
                {saving ? "Guardando…" : "Guardar puntaje"}
              </button>
            </div>
          )}

          {saveResult && (
            <div className={`rounded-2xl border px-4 py-3 text-center text-sm font-medium ${
              saveResult.saved
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}>
              {saveResult.saved
                ? `¡Guardado! Quedaste en el puesto #${saveResult.rank}`
                : "No llegaste al top 50 esta vez."}
            </div>
          )}

          {!eligible && score > 0 && (
            <p className="text-center text-xs text-slate-400">
              Tu puntaje no alcanza el top 50 esta vez.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-none gap-2.5 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onRetry}
            className="flex-1 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Jugar de nuevo
          </button>
          <a
            href={`/leaderboard?game=${game}`}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Ver ranking
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
