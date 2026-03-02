import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

interface ApartmentCarouselProps {
  images: string[];
}

const ApartmentCarousel = ({ images }: ApartmentCarouselProps) => {
  return (
    <Splide aria-label="Fotos del departamento" data-splide='{"type":"loop"}'>
      {images.map((image, index) => (
        <SplideSlide key={index}>
          <img
            src={image}
            alt={`Foto ${index + 1}`}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0px 0px 63px 57px rgba(0,0,0,0.58)",
            }}
            className="w-[120vw] md:w-[40%] z-0"
          />
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default ApartmentCarousel;
