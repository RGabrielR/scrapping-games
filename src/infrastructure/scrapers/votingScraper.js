const cheerio = require("cheerio");
import lawProjects from "@/data/lawProjects.json" assert { type: "json" };

/**
 * Scrapes a random deputy's vote from a randomly selected law project.
 * @returns {Promise<{ name, party, province, vote, photoLink, project, moreInfo }>}
 */
export const scrapeRandomDeputyVote = async () => {
  const randomIndex = Math.floor(Math.random() * lawProjects.length);
  const project = lawProjects[randomIndex];

  const html = await fetch(project.link).then((r) => r.text());
  const $ = cheerio.load(html);

  const deputies = [];
  $("table tr").each((_, row) => {
    const $tds = $(row).find("td");
    const name = $tds.eq(1).text().trim();
    if (!name) return;
    deputies.push({
      name,
      party: $tds.eq(2).text().trim(),
      province: $tds.eq(3).text().trim(),
      vote: $tds.eq(4).find("span").text().trim(),
      photoLink: $tds.eq(0).find("a").attr("href"),
      project: project.name,
      moreInfo: project.moreInfo,
    });
  });

  return deputies[Math.floor(Math.random() * deputies.length)];
};
