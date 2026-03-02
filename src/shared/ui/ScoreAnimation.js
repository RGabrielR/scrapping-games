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

const RESULT_IMAGES = {
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

const ScoreAnimation = ({ result, showAnimation }) => {
  const image = RESULT_IMAGES[result];
  return (
    <>
      {result && (
        <div
          className={`result-animation absolute z-30 ${
            showAnimation ? "animate-result" : ""
          }`}
          style={{
            transformOrigin: "center",
            transform: showAnimation
              ? "scale(1) translateX(0)"
              : "scale(0) translateX(75%)",
          }}
        >
          <Image src={image} className="w-96 top-4 z-20" alt="result icon" />
        </div>
      )}
    </>
  );
};

export default ScoreAnimation;
