import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns a random apartment from the database.
 * Decodes the `description` field from Bytes to a plain string.
 * @returns {Promise<object>}
 */
export const chooseRandomApartment = async () => {
  const ids = await prisma.guess_apartment.findMany({ select: { id: true } });
  const random = ids[Math.floor(Math.random() * ids.length)];
  const apartment = await prisma.guess_apartment.findUnique({
    where: { id: random.id },
  });
  return {
    ...apartment,
    description: Buffer.from(apartment.description).toString("utf8"),
  };
};

/**
 * Saves a new apartment record to the database.
 * Encodes `description` to Buffer before saving.
 * @param {object} apartmentData
 * @returns {Promise<object>}
 */
export const saveApartment = async (apartmentData) => {
  return prisma.guess_apartment.create({
    data: {
      ...apartmentData,
      description: Buffer.from(apartmentData.description, "utf8"),
    },
  });
};
