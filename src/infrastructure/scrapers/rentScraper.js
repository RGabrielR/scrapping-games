import puppeteer from "puppeteer-core";
import locations from "@/data/locations.json";
import { usdToArs } from "../converters/currencyConverter";

const chromium = require("@sparticuz/chromium");

const MIN_IMAGES = 3;
const MIN_METERS = 15;
const MAX_RETRIES = 10;
const MAX_TIMEOUT_MS = 30000;

const extractImages = (html) => {
  const matches = html.match(/src="([^"]+)"/g) || [];
  return new Set(
    matches
      .map((m) => m.match(/src="([^"]+)"/)[1])
      .filter(
        (url) =>
          !url.includes("Sprite") &&
          !url.includes("logo") &&
          !url.includes("placeholder") &&
          !url.includes("empresas") &&
          !url.includes(".svg") &&
          !url.includes(".png")
      )
  );
};

const extractMeters = (html) => {
  const match = html.match(/(\d+)\s*m²/);
  return match ? parseInt(match[1]) : 0;
};

const extractDataQaContent = (html, qaValue) => {
  const match = html.match(
    new RegExp(`<div data-qa="${qaValue}"[^>]*>(.*?)<\\/div>`)
  );
  return match ? match[1].trim() : null;
};

const fetchPageElements = async () => {
  const randomPage = Math.floor(Math.random() * 5) + 1;
  const randomLocation =
    locations[Math.floor(Math.random() * locations.length) - 1];
  const url = `https://www.zonaprop.com.ar/departamentos-alquiler-${randomLocation}-orden-publicado-descendente-pagina-${randomPage}.html`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );
  await page.goto(url);
  await page.waitForSelector(".postings-container");
  const elements = await page.$$eval(".postings-container > div", (divs) =>
    divs.map((d) => d.innerHTML)
  );
  await browser.close();
  return elements;
};

/**
 * Scrapes a valid apartment listing from Zonaprop.
 * Retries until it finds a listing with enough images, a real price, and valid m².
 * @returns {Promise<object>} Apartment data ready to be saved via rentRepository
 */
export const scrapeValidApartment = async () => {
  const elements = await fetchPageElements();
  const startTime = Date.now();
  let retries = 0;

  while (retries < MAX_RETRIES && Date.now() - startTime < MAX_TIMEOUT_MS) {
    const element = elements[Math.floor(Math.random() * elements.length)];
    const images = extractImages(element);
    const meters = extractMeters(element);
    const priceMatch = element.match(
      /<div data-qa="POSTING_CARD_PRICE"[^>]*>(.*?)<\/div>/
    );

    if (
      !priceMatch ||
      images.size < MIN_IMAGES ||
      meters < MIN_METERS ||
      priceMatch[1].trim().includes("Consultar")
    ) {
      retries++;
      continue;
    }

    const rawPrice = priceMatch[1].trim();
    const apartment = {
      arrayOfImages: Array.from(images),
      meters: `${meters} mts.`,
      location: extractDataQaContent(element, "POSTING_CARD_LOCATION") || "",
      description:
        extractDataQaContent(element, "POSTING_CARD_DESCRIPTION") || "",
    };

    const isUSD = element.includes("USD") || rawPrice.length < 5;
    if (isUSD) {
      const usdAmount = parseInt(rawPrice.replace("USD ", "").replace(/\./g, ""));
      const arsAmount = await usdToArs(usdAmount);
      apartment.prizeInUSD = rawPrice;
      apartment.prizeInARS = `ARS ${arsAmount}`;
    } else {
      apartment.prizeInARS = `ARS ${rawPrice}`;
    }

    return apartment;
  }

  throw new Error("Could not find a valid apartment after max retries");
};
