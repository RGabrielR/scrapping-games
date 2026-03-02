import * as cheerio from "cheerio";
import lawProjects from "@/data/lawProjects.json";
import type { Deputy } from "@/types";

// The senate page stores the vote as plain text in <td>.
// The deputies page wraps it in a <span> inside <td>.
// Both use "AFIRMATIVO" / "NEGATIVO" / "AUSENTE",
// but the senate uses "ABSTENCIÓN" (with accent) — normalize to "ABSTENCION".
const normalizeVote = (raw: string): string =>
  raw.replace("ABSTENCIÓN", "ABSTENCION");

export const scrapeRandomLegislatorVote = async (): Promise<Deputy> => {
  const randomIndex = Math.floor(Math.random() * lawProjects.length);
  const project = lawProjects[randomIndex];
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

    legislators.push({
      name,
      party: $tds.eq(2).text().trim(),
      province: $tds.eq(3).text().trim(),
      vote: normalizeVote(rawVote),
      photoLink: $tds.eq(0).find("a").attr("href"),
      project: project.name,
      moreInfo: project.moreInfo,
      chamber: project.chamber as "diputados" | "senadores",
    });
  });

  return legislators[Math.floor(Math.random() * legislators.length)];
};
