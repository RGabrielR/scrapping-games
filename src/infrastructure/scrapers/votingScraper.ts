import * as cheerio from "cheerio";
import lawProjects from "@/data/lawProjects.json";
import type { Deputy } from "@/types";

const GOOGLE_IMAGE_TIMEOUT_MS = 6000;
const IMAGE_CHECK_TIMEOUT_MS = 5000;
const GOOGLE_IMAGE_CACHE = new Map<string, string | undefined>();

// Both chambers use AFIRMATIVO / NEGATIVO / AUSENTE.
// Senate data may encode ABSTENCION with accents or mojibake.
const normalizeVote = (raw: string): string => {
  const normalized = raw
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/ABSTENCI/i.test(normalized)) return "ABSTENCION";
  return normalized;
};

const toAbsoluteUrl = (
  url: string | undefined,
  baseUrl: string
): string | undefined => {
  if (!url) return undefined;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return undefined;
  }
};

const fetchWithTimeout = async (
  url: string,
  timeoutMs: number,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const isLikelyPlaceholderImage = (url: string | undefined): boolean => {
  if (!url) return true;
  const normalized = url.toLowerCase();
  return (
    normalized.includes("/senadores/senador/") ||
    normalized.includes("nodisponible") ||
    normalized.includes("img-perfil")
  );
};

const isLikelyImageUrl = (url: string): boolean => {
  const normalized = url.toLowerCase();
  return (
    /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(normalized) ||
    normalized.includes("/assets/diputados/") ||
    normalized.includes("encrypted-tbn")
  );
};

const isImageResponse = async (url: string): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(url, IMAGE_CHECK_TIMEOUT_MS, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const contentType = response.headers.get("content-type") ?? "";
    return response.ok && contentType.startsWith("image/");
  } catch {
    return false;
  }
};

const extractGoogleThumbnailUrls = (html: string): string[] => {
  const matches = html.match(
    /https:\/\/encrypted-tbn\d+\.gstatic\.com\/images\?q=tbn:[^"' <]+/g
  );
  if (!matches) return [];
  return [...new Set(matches.map((url) => url.replaceAll("&amp;", "&")))];
};

// Converts "LAST, FIRST" (senate/deputy format) to "First Last" for Wikipedia search.
const toWikipediaQuery = (name: string): string =>
  name
    .split(",")
    .map((p) => p.trim())
    .reverse()
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const searchWikipediaPhoto = async (deputy: Deputy): Promise<string | undefined> => {
  const query = toWikipediaQuery(deputy.name);
  const cacheKey = `wiki:${query}`;
  if (GOOGLE_IMAGE_CACHE.has(cacheKey)) return GOOGLE_IMAGE_CACHE.get(cacheKey);

  try {
    const searchUrl =
      "https://es.wikipedia.org/w/api.php?action=query&list=search" +
      `&srsearch=${encodeURIComponent(query + " político Argentina")}` +
      "&format=json&origin=*&srlimit=3";

    const searchRes = await fetchWithTimeout(searchUrl, GOOGLE_IMAGE_TIMEOUT_MS, {
      headers: { Accept: "application/json" },
    });
    if (!searchRes.ok) {
      GOOGLE_IMAGE_CACHE.set(cacheKey, undefined);
      return undefined;
    }

    const searchData = (await searchRes.json()) as {
      query?: { search?: { title: string }[] };
    };
    const results = searchData.query?.search ?? [];

    for (const { title } of results.slice(0, 3)) {
      const photoUrl =
        "https://es.wikipedia.org/w/api.php?action=query" +
        `&titles=${encodeURIComponent(title)}&prop=pageimages` +
        "&format=json&pithumbsize=400&origin=*";

      const photoRes = await fetchWithTimeout(photoUrl, GOOGLE_IMAGE_TIMEOUT_MS, {
        headers: { Accept: "application/json" },
      });
      if (!photoRes.ok) continue;

      const photoData = (await photoRes.json()) as {
        query?: { pages?: Record<string, { thumbnail?: { source: string } }> };
      };
      const photo = Object.values(photoData.query?.pages ?? {})[0]?.thumbnail?.source;
      if (photo) {
        GOOGLE_IMAGE_CACHE.set(cacheKey, photo);
        return photo;
      }
    }

    GOOGLE_IMAGE_CACHE.set(cacheKey, undefined);
    return undefined;
  } catch {
    GOOGLE_IMAGE_CACHE.set(cacheKey, undefined);
    return undefined;
  }
};

const searchGoogleImage = async (deputy: Deputy): Promise<string | undefined> => {
  const chamberHint = deputy.chamber === "senadores" ? "senador argentino" : "diputado argentino";
  const cacheKey = `${deputy.chamber}:${deputy.name}:${deputy.province}`;

  if (GOOGLE_IMAGE_CACHE.has(cacheKey)) {
    return GOOGLE_IMAGE_CACHE.get(cacheKey);
  }

  try {
    const query = encodeURIComponent(`${deputy.name} ${deputy.province} ${chamberHint} foto`);
    const url = `https://www.google.com/search?tbm=isch&hl=es&q=${query}`;
    const response = await fetchWithTimeout(url, GOOGLE_IMAGE_TIMEOUT_MS, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      GOOGLE_IMAGE_CACHE.set(cacheKey, undefined);
      return undefined;
    }

    const html = await response.text();
    const firstCandidate = extractGoogleThumbnailUrls(html)[0];

    if (!firstCandidate) {
      GOOGLE_IMAGE_CACHE.set(cacheKey, undefined);
      return undefined;
    }

    GOOGLE_IMAGE_CACHE.set(cacheKey, firstCandidate);
    return firstCandidate;
  } catch {
    GOOGLE_IMAGE_CACHE.set(cacheKey, undefined);
    return undefined;
  }
};

const resolvePhotoLink = async (deputy: Deputy): Promise<string | undefined> => {
  const hasPlaceholderPhoto = isLikelyPlaceholderImage(deputy.photoLink);

  if (deputy.photoLink && !hasPlaceholderPhoto) {
    if (isLikelyImageUrl(deputy.photoLink)) return deputy.photoLink;
    if (await isImageResponse(deputy.photoLink)) return deputy.photoLink;
  }

  // Wikipedia is more reliable than Google for public figures (open API, no CAPTCHA).
  const wikiPhoto = await searchWikipediaPhoto(deputy);
  if (wikiPhoto) return wikiPhoto;

  const googlePhoto = await searchGoogleImage(deputy);
  if (googlePhoto) return googlePhoto;

  // Never return the official "no disponible" image from Senate sources.
  // Let the UI fallback image handle this case instead.
  if (hasPlaceholderPhoto) return undefined;

  return deputy.photoLink;
};

const scrapeProjectLegislators = async (
  project: (typeof lawProjects)[number]
): Promise<Deputy[]> => {
  const isSenado = project.link.includes("senado.gob.ar");

  const html = await fetch(project.link).then((r) => r.text());
  const $ = cheerio.load(html);

  const legislators: Deputy[] = [];
  $("table tr").each((_, row) => {
    const $tds = $(row).find("td");
    const name = $tds.eq(1).text().trim();
    if (!name) return;

    const rawVote = isSenado
      ? $tds.eq(4).text().trim()
      : $tds.eq(4).find("span").text().trim();
    if (!rawVote) return;

    const photoCandidate = isSenado
      ? $tds.eq(0).find("img").attr("src") ?? $tds.eq(0).find("a").attr("href")
      : $tds.eq(0).find("a").attr("href") ?? $tds.eq(0).find("img").attr("src");

    legislators.push({
      name,
      party: $tds.eq(2).text().trim(),
      province: $tds.eq(3).text().trim(),
      vote: normalizeVote(rawVote),
      photoLink: toAbsoluteUrl(photoCandidate, project.link),
      project: project.name,
      moreInfo: project.moreInfo,
      chamber: project.chamber as "diputados" | "senadores",
    });
  });

  return legislators;
};

export const scrapeRandomLegislatorVote = async (): Promise<Deputy> => {
  const attempted = new Set<number>();

  while (attempted.size < lawProjects.length) {
    const randomIndex = Math.floor(Math.random() * lawProjects.length);
    if (attempted.has(randomIndex)) continue;
    attempted.add(randomIndex);

    const project = lawProjects[randomIndex];
    try {
      const legislators = await scrapeProjectLegislators(project);
      if (legislators.length === 0) continue;

      const selectedDeputy =
        legislators[Math.floor(Math.random() * legislators.length)];
      if (!selectedDeputy?.name || !selectedDeputy?.project) continue;

      const resolvedPhotoLink = await resolvePhotoLink(selectedDeputy);
      return { ...selectedDeputy, photoLink: resolvedPhotoLink };
    } catch {
      continue;
    }
  }

  throw new Error(
    "No se encontraron legisladores validos en los proyectos configurados."
  );
};
