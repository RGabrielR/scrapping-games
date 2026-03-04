import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

interface ApartmentCarouselProps {
  images: string[];
}

const ApartmentCarousel = ({ images }: ApartmentCarouselProps) => {
  return (
    <div className="rent-carousel h-full overflow-hidden">
      <Splide
        aria-label="Fotos del departamento"
        options={{ type: "loop", cover: true }}
      >
        {images.map((image, index) => (
          <SplideSlide key={index}>
            <img
              src={image}
              alt={`Foto ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default ApartmentCarousel;
