import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fireImage = "https://s3.glbimg.com/v1/AUTH_1c3ee56c57864e2b9a34135c5ee67caf/gshow/emojis/emoji-tudomais.png";

async function fetchGoogleImages(query, page) {
  console.log(`Fetching Google Images for query: ${query}`);
  const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Espera extra para garantir que as imagens carreguem

  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    const validImages = images
      .filter((img) => !img.src.includes("gstatic.com") && !img.src.includes("google.com"))
      .slice(0, 10);
    return validImages.map((img) => img.src);
  });

  const filteredImages = imageUrls.filter((src) => src !== fireImage);
  filteredImages.sort((a, b) => b.length - a.length);
  return filteredImages.length > 0 ? filteredImages[0] : null;
}

async function scrapePage(url, page) {
  console.log(`Scraping page: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Espera para garantir que o conteúdo carregue

  const posts = await page.evaluate(async () => {
    function generateUniqueId() {
      return "id-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now().toString(36);
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

    const posts = Array.from(document.querySelectorAll(".post-item"));
    const data = posts.map((post) => {
      const title = post.querySelector(".post-materia-text__title")?.textContent;
      const imageUrl = post.querySelector("img")?.src;
      return {
        id: generateUniqueId(),
        url: post.querySelector(".post-materia-text")?.getAttribute("href"),
        title: title,
        category: "News",
        description: post.querySelector(".post-materia-text__description")?.textContent,
        imageUrl: imageUrl,
      };
    });

    return data.filter((post) => post.url);
  });

  for (const post of posts) {
    if (post.imageUrl === fireImage) {
      let newImageUrl = await fetchGoogleImages(post.title, page);
      if (!newImageUrl) {
        console.log(`No valid image found for: ${post.title}`);
      } else {
        post.imageUrl = newImageUrl;
      }
    }
  }

  return posts;
}

async function scrapeAndSave(url, tag) {
  console.log(`Scraping and saving data for URL: ${url}, Tag: ${tag}`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--single-process",
      '--js-flags="--max-old-space-size=512"', // Aumentar o limite de memória se possível
    ],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(100000);

  const posts = await scrapePage(url, page);

  await browser.close();

  const jsonData = { tag, posts };
  const jsonFilePath = path.join(__dirname, "..", "public", `${tag}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 3));
  console.log(`Data saved to ${jsonFilePath}`);
}

export { scrapeAndSave };
