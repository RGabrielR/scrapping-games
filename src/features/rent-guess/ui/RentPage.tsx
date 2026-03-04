"use client";
import ScoreAnimation from "@/shared/ui/ScoreAnimation";
import StrikesHUD from "@/shared/ui/StrikesHUD";
import GameOverModal from "@/shared/ui/GameOverModal";
import NavBurguer from "@/components/NavBurguer/NavBurguer";
import { scoreColor } from "@/shared/domain/scoreDisplay";
import { formatThousands } from "@/shared/lib/numberFormat";
import { useRentGame } from "../application/useRentGame";
import ApartmentCarousel from "./ApartmentCarousel";
import PriceInput from "./PriceInput";
import HintModal from "./HintModal";
import ResultModal from "./ResultModal";
import BuildingLoader from "./BuildingLoader";
import "tailwindcss/tailwind.css";
import "@/app/globals.scss";
import type { ApartmentData } from "@/types";

/** Escape every character that has special meaning in a RegExp pattern. */
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Case-insensitive, global replace of `pattern` in `text`. No-op when pattern is empty. */
const maskCI = (text: string, pattern: string): string =>
  pattern ? text.replace(new RegExp(escRe(pattern), "gi"), "XXXXXX") : text;

/** Masks price values in a description string so the hint doesn't reveal the answer. */
function buildMaskedDescription(apt: ApartmentData): string {
  let desc = apt.description || "";

  // 1. Mask the full price strings as they appear in the card (case-insensitive)
  if (apt.prizeInUSD) desc = maskCI(desc, apt.prizeInUSD);
  if (apt.prizeInARS) desc = maskCI(desc, apt.prizeInARS);

  // 2. Mask just the numeric portion (e.g. "1.200.000" or "470")
  const arsNum = formatThousands(apt.prizeInARS?.replace(/[^0-9]/g, "") ?? "");
  const usdNum = apt.prizeInUSD
    ? formatThousands(apt.prizeInUSD?.replace(/[^0-9]/g, "") ?? "")
    : "";
  if (arsNum) desc = maskCI(desc, arsNum);
  if (usdNum) desc = maskCI(desc, usdNum);

  // 3. Catch-all for any remaining "u$s NNN" / "USD NNN" patterns the above may have missed
  desc = desc.replace(/u\$s\s*[\d.,]+/gi, "XXXXXX");
  desc = desc.replace(/usd\s*[\d.,]+/gi, "XXXXXX");

  return desc;
}

const RentPage = () => {
  const {
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
    strikes,
    gameOver,
    resetGame,
  } = useRentGame();

  const maskedDescription = presentApartment ? buildMaskedDescription(presentApartment) : "";
  // Hint is useless when there is no description or it collapses entirely to masked tokens
  const hintDisabled = maskedDescription.replace(/XXXXXX/gi, "").trim().length < 5;

  return (
    <div
      className="voting-editorial-theme relative flex h-screen w-full flex-col overflow-hidden"
      style={{ fontFamily: "fontForProject, 'Avenir Next', 'Poppins', sans-serif" }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c084fc]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#60a5fa]/25 blur-3xl" />

      {/* Floating ?s */}
      <div className="voting-question-cloud pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="floating-question fq1">?</span>
        <span className="floating-question fq2">?</span>
        <span className="floating-question fq3">?</span>
        <span className="floating-question fq4">?</span>
        <span className="floating-question fq5">?</span>
        <span className="floating-question fq6">?</span>
        <span className="floating-question fq7">?</span>
        <span className="floating-question fq8">?</span>
      </div>

      {/* Score pill + strikes */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2">
        {score !== 0 && (
          <p
            style={{ color: scoreColor({ score, targetScore }) }}
            className="rounded-full border border-slate-200 bg-white/95 px-5 py-2 text-sm font-extrabold tracking-wide shadow-md backdrop-blur"
          >
            Puntaje: <span className="text-slate-900">{score}</span>
          </p>
        )}
        {strikes > 0 && <StrikesHUD strikes={strikes} />}
      </div>

      <NavBurguer />

      {showAnimation && <ScoreAnimation result={result} />}

      {presentApartment ? (
        <section className="relative z-10 mx-auto flex w-full min-h-0 flex-1 flex-col gap-3 px-4 pb-4 pt-14 sm:px-8 sm:pt-16">
          <header className="mx-auto flex max-w-2xl w-full flex-col items-center gap-1 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              ¿Cuánto está?
            </h1>
            <p className="text-pretty text-xs text-slate-600 sm:text-sm">
              Adiviná el precio de alquiler de departamentos reales en Argentina. ¡Cuanto más cerca, más puntos!
            </p>
          </header>
          <div className="relative flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#f8fafc]/95 shadow-[0_20px_70px_rgba(15,23,42,0.18)] backdrop-blur-sm mx-auto max-w-2xl">

            {/* Title bar */}
            <div className="flex-none border-b border-slate-100 bg-slate-50/80 px-5 py-2.5">
              <p className="text-sm font-extrabold tracking-tight text-slate-500">
                Departamento en alquiler ·{" "}
                <span className="text-slate-800">{presentApartment.location}</span>
              </p>
            </div>

            {/* Carousel — fills remaining space */}
            <div className="min-h-0 flex-1">
              <ApartmentCarousel images={presentApartment.arrayOfImages} />
            </div>

            {/* Controls — always visible */}
            <div className="flex-none flex flex-col gap-2.5 border-t border-slate-100 bg-[#f8fafc]/95 px-4 py-3 sm:px-5 sm:py-4">
              {/* Property badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {presentApartment.rooms && (
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white">
                    {presentApartment.rooms}
                  </span>
                )}
                {presentApartment.bedrooms && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
                    {presentApartment.bedrooms}
                  </span>
                )}
                {presentApartment.bathrooms && (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
                    {presentApartment.bathrooms}
                  </span>
                )}
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
                  {presentApartment.meters}
                </span>
                {presentApartment.expenses && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 shadow-sm">
                    Expensas {presentApartment.expenses}
                  </span>
                )}
                {presentApartment.city && (
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 shadow-sm">
                    {presentApartment.city}
                  </span>
                )}
              </div>

              {/* Price input */}
              <PriceInput
                value={guess}
                onChange={setGuess}
                onSubmit={submitGuess}
                onHint={() => setShowHint((h) => !h)}
                hintDisabled={hintDisabled}
              />
            </div>
          </div>
        </section>
      ) : (
        <div className="relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-6 text-center">
          <BuildingLoader />
        </div>
      )}

      {/* Hint modal */}
      {presentApartment && (
        <HintModal
          presentApartment={presentApartment}
          maskedDescription={maskedDescription}
          show={showHint}
          onClose={() => setShowHint(false)}
        />
      )}

      {/* Result modal */}
      {!gameOver && (
        <ResultModal
          lastApartment={lastApartment}
          show={showResult}
          onClose={() => setShowResult(false)}
        />
      )}

      <GameOverModal
        show={gameOver}
        game="cuanto-esta"
        score={score}
        strikes={strikes}
        onRetry={resetGame}
      />
    </div>
  );
};

export default RentPage;
