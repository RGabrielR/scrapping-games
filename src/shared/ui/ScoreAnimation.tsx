import wrong from "../../../public/wrong.svg";
import right from "../../../public/right.svg";
import excellent from "../../../public/excellent.svg";
import veryGood from "../../../public/veryGood.svg";
import good from "../../../public/good.svg";
import notBad from "../../../public/notBad.svg";
import bad from "../../../public/bad.svg";
import veryBad from "../../../public/veryBad.svg";
import awful from "../../../public/awful.svg";
import Image from "next/image";
import type { StaticImageData } from "next/image";

const RESULT_IMAGES: Record<string, StaticImageData> = {
  CORRECT: right,
  INCORRECT: wrong,
  EXCELLENT: excellent,
  "VERY-GOOD": veryGood,
  GOOD: good,
  "NOT-BAD": notBad,
  BAD: bad,
  "VERY-BAD": veryBad,
  AWFUL: awful,
};

interface ScoreAnimationProps {
  result: string | null;
  onAnimationEnd?: () => void;
}

const ScoreAnimation = ({ result, onAnimationEnd }: ScoreAnimationProps) => {
  const image = result ? RESULT_IMAGES[result] : undefined;
  if (!result || !image) return null;
  return (
    <div className="result-animation animate-result absolute z-30" onAnimationEnd={onAnimationEnd}>
      <Image src={image} className="w-96 top-4 z-20" alt="result icon" />
    </div>
  );
};

export default ScoreAnimation;
