import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeValidApartment } from "@/infrastructure/scrapers/rentScraper";
import type { ApartmentData } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApartmentData | { error: string }>
) {
  try {
    const apartment = await scrapeValidApartment();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error fetching random apartment:", error);
    res.status(500).json({ error: "Failed to fetch apartment" });
  }
}
