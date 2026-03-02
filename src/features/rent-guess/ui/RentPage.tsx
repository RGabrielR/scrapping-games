"use client";
import Image from "next/image";
import questionMark from "../../../../public/questionMark.svg";
import questionMarkClosing from "../../../../public/questionMarkClosing.svg";
import ScoreAnimation from "@/shared/ui/ScoreAnimation";
import ImageDescription from "@/shared/ui/ImageDescription";
import NavBurguer from "@/components/NavBurguer/NavBurguer";
import { scoreColor } from "@/shared/domain/scoreDisplay";
import { useRentGame } from "../application/useRentGame";
import ApartmentCarousel from "./ApartmentCarousel";
import PriceInput from "./PriceInput";
import HintModal from "./HintModal";
import ResultModal from "./ResultModal";
import "tailwindcss/tailwind.css";
import "@/app/globals.scss";

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
  } = useRentGame();

  return (
    <div
      className="bg-slate-300 h-screen w-screen relative"
      style={{ backgroundImage: "url('/rentalbackground.png')" }}
    >
      {score !== 0 && (
        <p
          style={{ color: scoreColor({ score, targetScore }) }}
          className="font-extrabold absolute top-2 left-4 text-3xl"
        >
          {score}
        </p>
      )}

      <NavBurguer />

      {showAnimation && <ScoreAnimation result={result} />}

      {presentApartment ? (
        <div className="flex flex-col justify-around h-[90%] xl:h-[75%] xl:pt-36">
          <div className="xl:pt-12">
            <div className="translate-x-[1rem] -translate-y-4 lg:-translate-x-16 z-0 relative">
              <Image
                className="absolute -left-16 lg:left-[4%] top-2 lg:top-6 w-52 sm:w-96"
                src={questionMark}
                alt="signo de pregunta"
              />
              <Image
                className="absolute -left-12 lg:left-[6%] top-2 lg:top-6 w-52 sm:w-96 opacity-[0.7] z-30"
                src={questionMark}
                alt="signo de pregunta"
              />
              <Image
                className="absolute -left-8 lg:left-[8%] top-2 lg:top-6 w-52 sm:w-96 opacity-[0.5] z-30"
                src={questionMark}
                alt="signo de pregunta"
              />
            </div>
            <p className="text-3xl lg:text-7xl mb-4 text-blue-950 -pl-8 text-center font-extrabold [text-shadow:_5px_4px_0_rgb(0_0_0_/_40%)]">
              Cuanto está
            </p>
          </div>

          <div className="mt-4 md:mt-0 z-20">
            <ApartmentCarousel images={presentApartment.arrayOfImages} />
            <div className="top-4">
              <ImageDescription
                data={[presentApartment.location, presentApartment.meters]}
              />
            </div>
          </div>

          <div className="flex justify-center bg-slate-400 border-gray-500 border-y-8 py-3 -mt-2 xl:-mt-28 xl:mb-6 bottom-64 sm:bottom-40 xl:bottom-52 w-screen z-20 shadow-2xl shadow-black">
            <p className="cursor-default text-black text-center relative text-md lg:text-2xl">
              este departamento
            </p>
            <div className="flex flex-row -mt-6 -ml-4">
              <Image className="w-16" src={questionMarkClosing} alt="signo de pregunta" />
              <Image
                className="w-16 opacity-[0.7] -ml-14"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
              <Image
                className="w-16 opacity-[0.5] -ml-14"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
            </div>
          </div>

          <PriceInput
            value={guess}
            onChange={setGuess}
            onSubmit={submitGuess}
            onHint={() => setShowHint(true)}
          />

          <HintModal
            presentApartment={presentApartment}
            show={showHint}
            onClose={() => setShowHint(false)}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="pulsing-6 md:-ml-12 -mt-32"></div>
        </div>
      )}

      <ResultModal
        lastApartment={lastApartment}
        show={showResult}
        onClose={() => setShowResult(false)}
      />
    </div>
  );
};

export default RentPage;
