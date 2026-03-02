"use client";

import Image from "next/image";
import questionMark from "../../../../public/questionMark.svg";
import questionMarkClosing from "../../../../public/questionMarkClosing.svg";
import BlurImage from "@/shared/ui/BlurImage";
import CongressLoader from "@/shared/ui/CongressLoader";
import ScoreAnimation from "@/shared/ui/ScoreAnimation";
import ImageDescription from "@/shared/ui/ImageDescription";
import NavBurguer from "@/components/NavBurguer/NavBurguer";
import { scoreColor } from "@/shared/domain/scoreDisplay";
import { useVotingGame } from "../application/useVotingGame";
import VoteOptions from "./VoteOptions";
import "tailwindcss/tailwind.css";
import "@/app/globals.scss";

const VotingPage = () => {
  const { deputy, lastDeputy, result, score, targetScore, showAnimation, fetchError, retry, vote } =
    useVotingGame();

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-slate-100/70"
      style={{
        backgroundImage: "url('/backgroundpattern.webp')",
        fontFamily: "'Inter','Poppins','Roboto',sans-serif",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-200/80 via-slate-100/90 to-slate-200/60" />

      {score !== 0 && (
        <div className="absolute left-4 top-4 z-50">
          <p
            style={{ color: scoreColor({ score, targetScore }) }}
            className="rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-semibold shadow-md backdrop-blur-sm transition-colors"
          >
            Puntaje:{" "}
            <span className="font-extrabold tracking-wide text-slate-900">
              {score}
            </span>
          </p>
        </div>
      )}

      <NavBurguer />

      {showAnimation && <ScoreAnimation result={result} />}

      {deputy ? (
        <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-3 py-8 sm:px-6">
          <div className="relative flex w-full flex-col items-center gap-3 text-center">
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <Image
                className="absolute -left-14 top-0 w-24 opacity-100 drop-shadow-md lg:-left-10 lg:w-28"
                src={questionMark}
                alt="signo de pregunta"
              />
              <Image
                className="absolute -left-4 top-4 w-18 opacity-70 drop-shadow-md lg:left-0 lg:w-24"
                src={questionMark}
                alt="signo de pregunta"
              />
              <Image
                className="absolute left-0 top-8 w-16 opacity-50 drop-shadow-md lg:left-4 lg:w-20"
                src={questionMark}
                alt="signo de pregunta"
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm sm:text-4xl">
              {"\u00BFC\u00F3mo vot\u00F3?"}
            </h1>
            <p className="max-w-2xl text-pretty text-sm text-slate-600 sm:text-base">
              {
                "Pon\u00E9 a prueba tu intuici\u00F3n y descubr\u00ED c\u00F3mo se pronunciaron las y los diputados en votaciones clave del Congreso."
              }
            </p>
          </div>

          <div className="relative flex w-full flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/95 p-5 pb-10 shadow-xl shadow-slate-300/30 backdrop-blur-md sm:p-6 sm:pb-12">
            <div className="grid w-full gap-4 lg:grid-cols-[minmax(150px,180px)_1fr] lg:items-start">
              <div className="flex flex-col items-center gap-2">
                <BlurImage
                  image={deputy?.photoLink}
                  classesToAdd="mx-auto aspect-[3/4] w-full max-w-[130px] rounded-2xl border border-slate-100 object-cover shadow-lg"
                />
                <div className="flex w-full flex-wrap items-center justify-center gap-1.5 text-center">
                  <ImageDescription data={[deputy.party, deputy.province]} />
                </div>
              </div>

              <div className="flex w-full flex-col items-center gap-4">
                <div className="w-full rounded-2xl bg-slate-100/80 px-4 py-3 text-center shadow-inner">
                  <p className="text-pretty text-sm font-medium text-slate-700 sm:text-[0.95rem]">
                    <span className="font-semibold text-blue-900 transition-colors duration-300 hover:text-blue-700">
                      {deputy.name}
                    </span>{" "}
                    {"en el proyecto"}{" "}
                    <span className="font-semibold text-blue-900 transition-colors duration-300 hover:text-blue-700">
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
                      className={`w-full rounded-xl border px-3.5 py-2 text-center text-xs font-semibold shadow-md transition-all duration-300 sm:text-sm ${
                        result === "CORRECT"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-rose-100 bg-rose-50 text-rose-700"
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

            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-2">
              <Image
                className="h-8 w-8 opacity-90 drop-shadow-md sm:h-10 sm:w-10"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
              <Image
                className="h-7 w-7 opacity-70 drop-shadow-md sm:h-9 sm:w-9"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
              <Image
                className="h-6 w-6 opacity-50 drop-shadow-md sm:h-8 sm:w-8"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
            </div>
          </div>
        </section>
      ) : (
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-10 text-center">
          {lastDeputy && (
            <div className="fade-in w-full rounded-3xl border border-slate-200 bg-white/95 px-5 py-7 text-pretty text-base text-slate-700 shadow-xl shadow-slate-300/30 backdrop-blur-sm sm:px-8 sm:py-9">
              <span className="font-semibold text-blue-900">{lastDeputy?.name}</span>{" "}
              {"en"}{" "}
              <span className="font-semibold text-blue-900">
                {lastDeputy?.project}
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
                {lastDeputy?.vote}
              </span>
            </div>
          )}

          {fetchError ? (
            <div className="fade-in flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-slate-600">
                {"No se pudo cargar la siguiente pregunta."}
              </p>
              <button
                onClick={retry}
                className="rounded-full bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
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
                className="fade-in w-full max-w-[14rem] rounded-full bg-blue-900 px-5 py-2.5 text-center text-xs font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:text-sm"
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
