import locations from "@/data/locations.json";
import { usdToArs } from "../converters/currencyConverter";
import type { ApartmentData } from "@/types";

/** Decode numeric HTML entities (&#xNN; and &#NNN;) and common named ones. */
const decodeHtmlEntities = (str: string): string =>
  str
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");

const MIN_IMAGES = 3;
const MIN_METERS = 15;
const MAX_PAGE = 5;

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
};

// ArgenProp URL: /departamento-alquiler-en-palermo  (page 1 = no suffix)
//                /departamento-alquiler-en-palermo-pagina-2
const buildUrl = (location: string, page: number): string => {
  const base = `https://www.argenprop.com/departamento-alquiler-en-${location}`;
  return page === 1 ? base : `${base}-pagina-${page}`;
};

interface ParsedListing {
  location: string;
  city?: string;
  meters: number;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  expenses?: string;
  price: string;
  isUSD: boolean;
  description: string;
  images: string[];
}

const parseListings = (html: string): ParsedListing[] => {
  // Each listing is wrapped in: class="listing__item " id="NNNNN"
  const itemPositions = [
    ...html.matchAll(/class="listing__item [^"]*" id="\d+"/g),
  ].map((m) => m.index!);

  const results: ParsedListing[] = [];

  for (let i = 0; i < itemPositions.length; i++) {
    const block = html.slice(
      itemPositions[i],
      itemPositions[i + 1] ?? itemPositions[i] + 8000
    );

    // --- Location ---
    // "Departamento en Alquiler en NEIGHBORHOOD, BARRIO/CITY"
    const locationMatch = block.match(
      /card__title--primary[^>]*>\s*(?:Departamento [^<]*en\s+)?([^<,]+?)(?:,\s*([^<]+?))?\s*<\/p>/
    );
    const location = locationMatch
      ? decodeHtmlEntities(locationMatch[1].trim().replace(/Departamento.*?en\s+/i, "").trim())
      : "";
    const cityRaw = locationMatch?.[2]?.trim() ?? "";
    // Only keep city when it adds information (different from the sub-neighbourhood)
    const city = cityRaw && cityRaw.toLowerCase() !== location.toLowerCase()
      ? decodeHtmlEntities(cityRaw)
      : undefined;

    // --- Features (rooms, bedrooms, bathrooms, m²) ---
    const featuresBlock = block.match(/card__main-features[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? "";
    const featuresText = featuresBlock.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const roomsMatch = featuresText.match(/(\d+)\s*amb/i);
    const rooms = roomsMatch
      ? decodeHtmlEntities(`${roomsMatch[1]} amb.`)
      : undefined;

    const bedroomsMatch = featuresText.match(/(\d+)\s*dorm/i);
    const bedrooms = bedroomsMatch
      ? decodeHtmlEntities(`${bedroomsMatch[1]} dorm.`)
      : undefined;

    const bathroomsMatch = featuresText.match(/(\d+)\s*ba[nñ]/i);
    const bathrooms = bathroomsMatch
      ? decodeHtmlEntities(`${bathroomsMatch[1]} baño${bathroomsMatch[1] !== "1" ? "s" : ""}`)
      : undefined;

    // --- Meters ---
    const metersMatch = block.match(/(\d+)\s*m(?:&#xB2;|²)\s*cubie/i) ??
      block.match(/(\d+)\s*m(?:&#xB2;|²)/i);
    const meters = metersMatch ? parseInt(metersMatch[1]) : 0;
    if (meters < MIN_METERS) continue;

    // --- Price ---
    const priceBlock = block.match(/card__price[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
    const priceText = priceBlock.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // Extract expenses before stripping the &plus; part
    const expensesMatch = priceText.replace(/&plus;/g, "+").match(/\+[^$]*\$?\s*([\d.,]+)/);
    const expenses = expensesMatch ? `$ ${expensesMatch[1]}` : undefined;

    const rawPrice = priceText
      .replace(/&plus;[\s\S]*/g, "")  // strip "+ expenses" part
      .replace(/\s+/g, " ")
      .trim();

    if (!rawPrice || rawPrice.toLowerCase().includes("consultar")) continue;

    const isUSD = /u\$s|usd/i.test(rawPrice);

    // --- Description ---
    const descMatch = block.match(/card__info[^>]*>\s*([\s\S]*?)\s*<\/p>/);
    const description = descMatch
      ? decodeHtmlEntities(descMatch[1].replace(/<[^>]+>/g, ""))
          .replace(/\r\n/g, "\n")       // normalise line endings
          .replace(/\n{3,}/g, "\n\n")   // collapse excess blank lines
          .trim()
      : "";

    // --- Images (replace _u_small with _u_large for better quality) ---
    const rawImages = [
      ...block.matchAll(
        /(?:src|data-src)="(https:\/\/www\.argenprop\.com\/static-content\/\d+\/[a-f0-9-]+_u_small\.jpg)"/g
      ),
    ].map((m) => m[1].replace("_u_small", "_u_large"));

    const images = [...new Set(rawImages)];
    if (images.length < MIN_IMAGES) continue;

    results.push({ location, city, meters, rooms, bedrooms, bathrooms, expenses, price: rawPrice, isUSD, description, images });
  }

  return results;
};

const scrapeOnePage = async (): Promise<ApartmentData> => {
  const page = Math.floor(Math.random() * MAX_PAGE) + 1;
  const location = locations[Math.floor(Math.random() * locations.length)];
  const url = buildUrl(location, page);

  const response = await fetch(url, { headers: FETCH_HEADERS });
  if (!response.ok) throw new Error(`ArgenProp responded ${response.status}`);
  const html = await response.text();

  const listings = parseListings(html);
  if (listings.length === 0) throw new Error("No valid listings found on page");

  const picked = listings[Math.floor(Math.random() * listings.length)];

  let prizeInARS: string;
  let prizeInUSD: string | undefined;

  if (picked.isUSD) {
    const usdAmount = parseInt(
      picked.price.replace(/[^0-9]/g, ""),
      10
    );
    const arsAmount = await usdToArs(usdAmount);
    prizeInUSD = picked.price;
    prizeInARS = `ARS ${arsAmount.toLocaleString("es-AR")}`;
  } else {
    prizeInARS = `ARS ${picked.price.replace(/[$\s]/g, "")}`;
  }

  return {
    arrayOfImages: picked.images,
    meters: `${picked.meters} mts.`,
    location: picked.location || location,
    description: picked.description,
    prizeInARS,
    prizeInUSD,
    city: picked.city,
    rooms: picked.rooms,
    bedrooms: picked.bedrooms,
    bathrooms: picked.bathrooms,
    expenses: picked.expenses,
  };
};

export const scrapeValidApartment = async (): Promise<ApartmentData> => {
  const MAX_RETRIES = 5;
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await scrapeOnePage();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw new Error(
    `Could not scrape a valid apartment after ${MAX_RETRIES} attempts: ${lastError.message}`
  );
};
