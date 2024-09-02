import { scrapeAndSave } from "../services/ScrapingService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeAndSaveData(req, res) {
  const { url, tag } = req.body;
  try {
    await scrapeAndSave(url, tag);
    res.status(200).json({ message: "Data scraped and saved successfully." });
  } catch (error) {
    console.error("Error scraping and saving data:", error);
    res.status(500).json({ error: "Error scraping and saving data" });
  }
}

function getScrapedData(req, res) {
  const dataFilePath = path.join(__dirname, "..", "public", "tudo-mais.json");
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading data file" });
      return;
    }
    res.json(JSON.parse(data));
  });
}

export { getScrapedData, scrapeAndSaveData };
