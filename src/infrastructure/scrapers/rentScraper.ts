import { execFile } from "child_process";
import { promisify } from "util";
import locations from "@/data/locations.json";
import { usdToArs } from "../converters/currencyConverter";
import type { ApartmentData } from "@/types";

const execFileAsync = promisify(execFile);

const MIN_IMAGES = 3;
const MIN_METERS = 15;
const MAX_PAGE = 5;

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
};

// Converts avisoId (e.g. "58488356") to the path segments used in CDN URLs.
// ZonaProp pads the ID to 10 digits and splits into 2-digit chunks:
//   "58488356" → "00/58/48/83/56"
const avisoIdToPath = (avisoId: string): string =>
  avisoId
    .padStart(10, "0")
    .match(/.{2}/g)!
    .join("/");

const parseSchemas = (html: string) => {
  return [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]) as Record<string, unknown>;
      } catch {
        return null;
      }
    })
    .filter((s): s is Record<string, unknown> => s !== null);
};

interface ListingEntry {
  description?: string;
  url?: string;
  contentLocation?: { name?: string };
}

const buildUrl = (location: string, page: number): string => {
  // ZonaProp 301-redirects the -pagina-1 variant to the base URL.
  // Use the canonical base URL for page 1 to avoid that redirect.
  const base = `https://www.zonaprop.com.ar/departamentos-alquiler-${location}-orden-publicado-descendente`;
  return page === 1 ? `${base}.html` : `${base}-pagina-${page}.html`;
};

// Node.js native fetch is blocked by Cloudflare's JA3 TLS fingerprint detection.
// Spawning curl uses a different TLS stack (Schannel on Windows, OpenSSL on Linux)
// that passes Cloudflare's bot check.
const fetchHtml = async (url: string): Promise<string> => {
  const args = [
    "-s", "-L", "--compressed", "--max-time", "30",
    "-H", `User-Agent: ${FETCH_HEADERS["User-Agent"]}`,
    "-H", `Accept: ${FETCH_HEADERS.Accept}`,
    "-H", `Accept-Language: ${FETCH_HEADERS["Accept-Language"]}`,
    "-H", "Cache-Control: max-age=0",
    "-H", "Upgrade-Insecure-Requests: 1",
    url,
  ];
  const { stdout } = await execFileAsync("curl", args, {
    maxBuffer: 20 * 1024 * 1024,
  });
  return stdout;
};

const scrapeOnePage = async (): Promise<ApartmentData> => {
  const page = Math.floor(Math.random() * MAX_PAGE) + 1;
  const location = locations[Math.floor(Math.random() * locations.length)];
  const url = buildUrl(location, page);

  const html = await fetchHtml(url);

  const schemas = parseSchemas(html);

  // Apartment schemas hold the name with m² info (same order as listings)
  const apartments = schemas.filter((s) => s["@type"] === "Apartment") as {
    name?: string;
  }[];

  // RealEstateListing holds description, URL and contentLocation per listing
  const realEstateListing = schemas.find(
    (s) => s["@type"] === "RealEstateListing"
  ) as { mainEntity?: ListingEntry[] } | undefined;
  const listings: ListingEntry[] = realEstateListing?.mainEntity ?? [];

  // Prices in page order
  const prices = [
    ...html.matchAll(/data-qa="POSTING_CARD_PRICE"[^>]*>([^<]+)</g),
  ].map((m) => m[1].trim());

  if (listings.length === 0 || prices.length === 0) {
    throw new Error("No listings found on page");
  }

  // Build a pool of valid listings and pick one at random
  const indices = Array.from({ length: listings.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5); // shuffle to avoid always picking index 0

  for (const i of indices) {
    const listing = listings[i];
    const price = prices[i];

    if (!price || price.includes("Consultar") || !listing?.url) continue;

    const metersMatch = apartments[i]?.name?.match(/(\d+)m²/);
    const meters = metersMatch ? parseInt(metersMatch[1]) : 0;
    if (meters < MIN_METERS) continue;

    const avisoId = listing.url.match(/-(\d+)\.html$/)?.[1];
    if (!avisoId) continue;

    const avisoPath = avisoIdToPath(avisoId);

    // Collect all 720×532 images for this listing, stripping query params
    const imageSet = new Set<string>();
    for (const [, raw] of html.matchAll(
      /https:\/\/imgar\.zonapropcdn\.com\/avisos\/[^"'\s]+\.jpg(?:\?[^"'\s]*)?/g
    )) {
      const clean = raw.split("?")[0];
      if (clean.includes(avisoPath) && clean.includes("720x532")) {
        imageSet.add(clean);
      }
    }

    if (imageSet.size < MIN_IMAGES) continue;

    const isUSD = price.includes("USD");
    let prizeInARS: string;
    let prizeInUSD: string | undefined;

    if (isUSD) {
      const usdAmount = parseInt(
        price.replace("USD ", "").replace(/\./g, ""),
        10
      );
      const arsAmount = await usdToArs(usdAmount);
      prizeInUSD = price;
      prizeInARS = `ARS ${arsAmount.toLocaleString("es-AR")}`;
    } else {
      prizeInARS = `ARS ${price.replace("$ ", "")}`;
    }

    return {
      arrayOfImages: [...imageSet],
      meters: `${meters} mts.`,
      location: listing.contentLocation?.name ?? location,
      description: listing.description ?? "",
      prizeInARS,
      prizeInUSD,
    };
  }

  throw new Error("No valid apartment found on this page");
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
