import NextImage from "next/image";
import { useState, useEffect } from "react";

const FALLBACK_IMAGE =
  "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1706919556~exp=1706920156~hmac=4f8f900412d171ddb5095c17810818821e9c3a3e893f4f7c114acefda4208fed";

interface BlurImageProps {
  image: string | undefined;
  classesToAdd?: string;
  wrapperClass?: string;
}

export default function BlurImage({ image, classesToAdd, wrapperClass }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(image ?? FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(image ?? FALLBACK_IMAGE);
    setLoading(true);
  }, [image]);

  return (
    <a href="#" className="group">
      <div className={`overflow-hidden ${wrapperClass ?? "aspect-w-1 aspect-h-1 w-full xl:aspect-w-7 xl:aspect-h-8"}`}>
        <NextImage
          alt=""
          src={imageSrc}
          // Portrait dimensions matching the 3:4 display ratio.
          // Next.js uses these to serve a properly-sized optimized image.
          width={210}
          height={280}
          className={`
            h-full w-full object-cover duration-700 ease-in-out group-hover:opacity-75 ${classesToAdd ?? ""}
            ${
              isLoading
                ? "scale-110 blur-2xl grayscale"
                : "scale-100 blur-0 grayscale-0"
            }
          `}
          onLoad={() => setLoading(false)}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
          }}
        />
      </div>
    </a>
  );
}
