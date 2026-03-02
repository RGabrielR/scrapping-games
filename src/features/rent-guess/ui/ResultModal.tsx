import { Button, Modal } from "flowbite-react";
import { formatThousands } from "@/shared/lib/numberFormat";
import type { ApartmentWithResult } from "@/types";

interface ResultModalProps {
  lastApartment: ApartmentWithResult | null;
  show: boolean;
  onClose: () => void;
}

const ResultModal = ({ lastApartment, show, onClose }: ResultModalProps) => {
  if (!lastApartment) return null;

  const { title, feedbackMessage, guess, prizeInUSD, prizeInARS } = lastApartment;

  let priceContext: string;
  if (prizeInUSD) {
    priceContext = `El precio esta en ${formatThousands(
      prizeInUSD
    )} Dólares, pero al cambio del día de la fecha equivale a $${formatThousands(
      prizeInARS?.replace("ARS ", "") ?? ""
    )} ARS. `;
  } else {
    priceContext = `El precio se encuentra en ${formatThousands(
      prizeInARS?.replace("ARS ", "") ?? ""
    )} ARS, se oferta a pesos argentinos. `;
  }

  const fullDescription = `Dijiste ${guess}. ${priceContext}${feedbackMessage}`;

  return (
    <Modal show={show} size="6xl" onClose={onClose}>
      <Modal.Header className="pl-12">
        <span className="text-xl md:text-4xl text-bold -pb-2">{title}</span>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6">
          <p className="leading-relaxed text-gray-500 dark:text-gray-400 text-sm md:text-2xl">
            {fullDescription}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResultModal;
