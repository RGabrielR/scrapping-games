import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeRandomDeputyVote } from "@/infrastructure/scrapers/votingScraper";
import type { Deputy } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Deputy | { error: string }>
) {
  try {
    const deputy = await scrapeRandomDeputyVote();
    res.status(200).json(deputy);
  } catch (error) {
    console.error("Error scraping deputy vote:", error);
    res.status(500).json({ error: "Failed to fetch voting data" });
  }
}
