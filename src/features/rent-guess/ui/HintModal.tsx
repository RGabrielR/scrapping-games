import { Button, Modal } from "flowbite-react";
import { formatThousands } from "@/shared/lib/numberFormat";
import type { ApartmentData } from "@/types";

interface HintModalProps {
  presentApartment: ApartmentData;
  show: boolean;
  onClose: () => void;
}

const HintModal = ({ presentApartment, show, onClose }: HintModalProps) => {
  if (!presentApartment) return null;

  const formattedARS = formatThousands(
    presentApartment.prizeInARS?.replace(/[^0-9]/g, "") ?? ""
  );
  const formattedUSD = presentApartment.prizeInUSD
    ? formatThousands(presentApartment.prizeInUSD?.replace(/[^0-9]/g, "") ?? "")
    : null;

  const maskedDescription = (presentApartment.description || "")
    .replace(presentApartment.prizeInUSD || "", "XXXXXX")
    .replace(presentApartment.prizeInARS ?? "", "XXXXXX")
    .replace(formattedARS, "XXXXXX")
    .replace(formattedUSD || "", "XXXXXX");

  return (
    <Modal show={show} size="6xl" onClose={onClose}>
      <Modal.Header className="pl-12">Pista</Modal.Header>
      <Modal.Body>
        <div className="space-y-6 p-6">
          <p className="leading-relaxed text-gray-500 dark:text-gray-400 text-lg xl:text-2xl">
            El precio esta en{" "}
            {presentApartment.prizeInUSD ? (
              <span className="text-bold text-green-600">Dólares</span>
            ) : (
              <span className="text-bold text-blue-600">Pesos</span>
            )}
            .
          </p>
          <p className="text-xs xl:text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {maskedDescription}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HintModal;
