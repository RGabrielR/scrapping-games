import { scrapeRandomDeputyVote } from "@/infrastructure/scrapers/votingScraper";

export default async function handler(req, res) {
  try {
    const deputy = await scrapeRandomDeputyVote();
    res.status(200).json(deputy);
  } catch (error) {
    console.error("Error scraping deputy vote:", error);
    res.status(500).json({ error: "Failed to fetch voting data" });
  }
}
