import { chooseRandomApartment } from "@/infrastructure/db/rentRepository";

export default async function handler(req, res) {
  try {
    const apartment = await chooseRandomApartment();
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Error fetching random apartment:", error);
    res.status(500).json({ error: "Failed to fetch apartment" });
  }
}
