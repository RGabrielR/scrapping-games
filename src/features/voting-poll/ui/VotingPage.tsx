"use client";

import BlurImage from "@/shared/ui/BlurImage";
import CongressLoader from "@/shared/ui/CongressLoader";
import ScoreAnimation from "@/shared/ui/ScoreAnimation";
import ImageDescription from "@/shared/ui/ImageDescription";
import { scoreColor } from "@/shared/domain/scoreDisplay";
import { useVotingGame } from "../application/useVotingGame";
import VoteOptions from "./VoteOptions";
import "tailwindcss/tailwind.css";
import "@/app/globals.scss";

const VotingPage = () => {
  const {
    deputy,
    lastDeputy,
    result,
    score,
    targetScore,
    showAnimation,
    fetchError,
    retry,
    vote,
    handleAnimationEnd,
  } = useVotingGame();

  return (
    <div
      className="voting-editorial-theme relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        fontFamily: "fontForProject, 'Avenir Next', 'Poppins', sans-serif",
      }}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c084fc]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#60a5fa]/25 blur-3xl" />
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

      {score !== 0 && (
        <div className="absolute left-4 top-4 z-50">
          <p
            style={{ color: scoreColor({ score, targetScore }) }}
            className="rounded-full border border-slate-200 bg-white/95 px-5 py-2 text-sm font-extrabold tracking-wide shadow-md backdrop-blur"
          >
            Puntaje: <span className="text-slate-900">{score}</span>
          </p>
        </div>
      )}

{showAnimation && (
        <ScoreAnimation result={result} onAnimationEnd={handleAnimationEnd} />
      )}

      {deputy ? (
        <section className="relative z-10 mx-auto flex w-full flex-1 flex-col justify-center gap-5 px-4 py-4 sm:px-8">
          <header className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {"\u00BFC\u00F3mo vot\u00F3?"}
            </h1>
            <p className="text-pretty text-sm text-slate-700 sm:text-base">
              {"Pon\u00E9 a prueba tu intuici\u00F3n y descubr\u00ED c\u00F3mo se pronunciaron diputadas, diputados y senadores en votaciones clave del Congreso."}
            </p>
          </header>

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-[#f8fafc]/95 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:p-7">
            <div className="grid w-full gap-5 lg:grid-cols-[minmax(170px,190px)_1fr] lg:items-start">
              <div className="flex flex-col items-center gap-3">
                <BlurImage
                  image={deputy.photoLink}
                  wrapperClass="mx-auto aspect-[3/4] w-full max-w-[140px] rounded-[22px] border border-slate-200 shadow-md"
                  classesToAdd="object-cover"
                />
                <div className="flex w-full flex-wrap items-center justify-center gap-1.5 text-center">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-wide text-white ${
                      deputy.chamber === "senadores"
                        ? "bg-violet-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {deputy.chamber === "senadores" ? "Senado" : "Diputados"}
                  </span>
                  <ImageDescription data={[deputy.party, deputy.province]} />
                </div>
              </div>

              <div className="flex w-full flex-col items-center gap-4">
                <div className="w-full rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-slate-200">
                  <p className="text-pretty text-sm font-medium text-slate-700 sm:text-[0.95rem]">
                    <span className="font-extrabold text-slate-900">
                      {deputy.name}
                    </span>{" "}
                    {"en el proyecto"}{" "}
                    <span className="font-extrabold text-slate-900">
                      {deputy.project}
                    </span>
                  </p>
                </div>

                <div className="flex w-full max-w-xl flex-col items-center gap-3">
                  <div className="flex w-full flex-wrap justify-center gap-2">
                    <VoteOptions onVote={vote} />
                  </div>
                  {result && (
                    <div
                      className={`w-full rounded-2xl border px-3.5 py-2 text-center text-xs font-bold shadow-sm transition-all duration-300 sm:text-sm ${
                        result === "CORRECT"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {result === "CORRECT"
                        ? "\u00A1Excelente! Coincidiste con la votaci\u00F3n."
                        : "Ups, ese voto no coincidi\u00F3. \u00A1Prob\u00E1 nuevamente!"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-6 text-center">
          {lastDeputy && (
            <div className="fade-in w-full rounded-[24px] border border-slate-200 bg-white/95 px-5 py-7 text-pretty text-base text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:px-8 sm:py-9">
              <span
                className={`mr-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white ${
                  lastDeputy.chamber === "senadores"
                    ? "bg-violet-500"
                    : "bg-blue-500"
                }`}
              >
                {lastDeputy.chamber === "senadores" ? "Senado" : "Diputados"}
              </span>
              <span className="font-bold text-slate-900">{lastDeputy.name}</span>{" "}
              {"en"}{" "}
              <span className="font-bold text-slate-900">
                {lastDeputy.project}
              </span>{" "}
              {lastDeputy.vote === "ABSTENCION"
                ? "hizo una"
                : lastDeputy.vote === "AUSENTE"
                ? "estuvo"
                : "vot\u00F3"}{" "}
              <span
                className={`font-semibold ${
                  lastDeputy.vote === "AFIRMATIVO"
                    ? "text-emerald-600"
                    : lastDeputy.vote === "NEGATIVO"
                    ? "text-rose-600"
                    : "text-amber-600"
                }`}
              >
                {lastDeputy.vote}
              </span>
            </div>
          )}

          {fetchError ? (
            <div className="fade-in flex flex-col items-center gap-4 rounded-2xl border border-rose-200 bg-white/90 px-6 py-5 shadow-md">
              <p className="text-sm font-medium text-slate-600">
                {"No se pudo cargar la siguiente pregunta."}
              </p>
              <button
                onClick={retry}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                {"Reintentar"}
              </button>
            </div>
          ) : (
            <CongressLoader />
          )}

          {lastDeputy && (
            <div className="flex w-full justify-center">
              <a
                target="_blank"
                href={lastDeputy.moreInfo}
                className="fade-in w-full max-w-[16rem] rounded-xl bg-slate-900 px-5 py-2.5 text-center text-xs font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 sm:text-sm"
              >
                {"M\u00E1s informaci\u00F3n"}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VotingPage;
