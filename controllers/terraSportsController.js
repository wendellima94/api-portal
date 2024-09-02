import { scrapeAndSaveTerra } from "../services/TerraScrapingService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeAndSaveData(req, res) {
  const tag = "terra-esportes";
  const url = "https://www.terra.com.br/esportes/";

  try {
    await scrapeAndSaveTerra(url, tag);
    res.status(200).json({ message: "Data scraped and saved successfully." });
  } catch (error) {
    console.error("Error scraping and saving data:", error);
    res.status(500).json({ error: "Error scraping and saving data" });
  }
}

function getScrapedData(req, res) {
  const dataFilePath = path.join(
    __dirname,
    "..",
    "public",
    "terra-esportes.json"
  );
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading data file" });
      return;
    }
    res.json(JSON.parse(data));
  });
}

export { getScrapedData, scrapeAndSaveData };
