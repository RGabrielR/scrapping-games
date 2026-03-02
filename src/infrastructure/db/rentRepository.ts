import { PrismaClient } from "@prisma/client";
import type { ApartmentData } from "@/types";

const prisma = new PrismaClient();

export const chooseRandomApartment = async (): Promise<ApartmentData> => {
  const ids = await prisma.guess_apartment.findMany({ select: { id: true } });
  const random = ids[Math.floor(Math.random() * ids.length)];
  const apartment = await prisma.guess_apartment.findUnique({
    where: { id: random.id },
  });
  if (!apartment) throw new Error("Apartment not found");
  return {
    arrayOfImages: apartment.arrayOfImages as string[],
    meters: apartment.meters,
    location: apartment.location,
    description: Buffer.from(apartment.description).toString("utf8"),
    prizeInARS: apartment.prizeInARS,
    prizeInUSD: apartment.prizeInUSD ?? undefined,
  };
};

export const saveApartment = async (apartmentData: ApartmentData) => {
  return prisma.guess_apartment.create({
    data: {
      description: Buffer.from(apartmentData.description, "utf8"),
      location: apartmentData.location,
      prizeInARS: apartmentData.prizeInARS ?? "",
      prizeInUSD: apartmentData.prizeInUSD,
      meters: apartmentData.meters,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arrayOfImages: apartmentData.arrayOfImages as any,
    },
  });
};
