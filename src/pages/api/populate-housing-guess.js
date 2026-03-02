import { scrapeValidApartment } from "@/infrastructure/scrapers/rentScraper";
import { saveApartment } from "@/infrastructure/db/rentRepository";

const MAX_EXECUTIONS = 5;
const DELAY_MS = 40000;

async function populateWithDelay() {
  try {
    for (let i = 0; i < MAX_EXECUTIONS; i++) {
      const apartment = await scrapeValidApartment();
      await saveApartment(apartment);
      console.log(`Execution ${i + 1} completed.`);
      if (i < MAX_EXECUTIONS - 1) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }
    console.log("All executions completed.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

populateWithDelay();
