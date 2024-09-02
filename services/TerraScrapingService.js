import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapePageTerra(url, page) {
  console.log(`Scraping page: ${url}`);
  await page.goto(url, { waitUntil: "networkidle2" });

  const posts = await page.evaluate(async () => {
    function generateUniqueId() {
      return (
        "id-" +
        Math.random().toString(36).substr(2, 9) +
        "-" +
        Date.now().toString(36)
      );
    }
    await new Promise((resolve) => {
      const distance = 100;
      let scrolledAmount = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolledAmount += distance;
        if (scrolledAmount >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });

    const posts = Array.from(document.querySelectorAll(".card-news"));
    const data = posts.map((post) => {
      const title =
        post.querySelector(".card-news__text--title")?.textContent ||
        "No Title";
      const imageUrl = post.querySelector("img")?.src || "No Image";
      const url =
        post.querySelector(".card-news__url")?.getAttribute("href") || "#";
      const category =
        post.querySelector(".card-news__text--hat")?.textContent ||
        "No Description";

      return {
        id: generateUniqueId(),
        url,
        title,
        category,
        imageUrl,
      };
    });

    return data.filter((post) => post.url && post.url !== "#");
  });

  return posts;
}

async function scrapeAndSaveTerra(url, tag) {
  console.log(`Scraping and saving data for URL: ${url}, Tag: ${tag}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);

  const posts = await scrapePageTerra(url, page);

  await browser.close();

  const jsondata = { tag, posts };
  const jsonFilePath = path.join(__dirname, "..", "public", `${tag}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsondata, null, 3));
  console.log(`Data saved to ${jsonFilePath}`);
}

export { scrapeAndSaveTerra };
