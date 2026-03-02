import type { NextApiRequest, NextApiResponse } from "next";
import { chooseRandomApartment } from "@/infrastructure/db/rentRepository";
import type { ApartmentData } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApartmentData | { error: string }>
) {
  try {
    const apartment = await chooseRandomApartment();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error fetching random apartment:", error);
    res.status(500).json({ error: "Failed to fetch apartment" });
  }
}
