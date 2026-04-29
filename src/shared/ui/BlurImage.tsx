import NextImage from "next/image";
import { useState, useEffect } from "react";

const FALLBACK_IMAGE =
  "/fallback-speaker-podium.jpg";

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
          unoptimized
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
