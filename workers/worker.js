import { scrapeAndSave } from "../services/ScrapingService.js";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

let activeThreads = 0;

const urls = [
  // { tag: "bbb", url: "https://gshow.globo.com/realities/bbb" },
  // { tag: "moda-e-beleza", url: "https://gshow.globo.com/moda-e-beleza" },
  // { tag: "horoscopo-etc", url: "https://gshow.globo.com/horoscopo-etc" },
  // { tag: "tudo-mais", url: "https://gshow.globo.com/tudo-mais" },
  // { tag: "podcast", url: "https://gshow.globo.com/podcast/" },
];

async function runService(workerData) {
  console.log("Starting new worker with data:", workerData);
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), { workerData });
    activeThreads++;
    console.log(`Thread started. Active threads: ${activeThreads}`);

    worker.on("message", (message) => {
      resolve(message);
      activeThreads--;
      console.log(`Thread finished. Active threads: ${activeThreads}`);
    });

    worker.on("error", (error) => {
      reject(error);
      activeThreads--;
      console.log(`Thread error. Active threads: ${activeThreads}`);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
        activeThreads--;
        console.log(
          `Thread exited with code ${code}. Active threads: ${activeThreads}`
        );
      }
    });
  });
}

async function run() {
  console.log("Running main function");
  try {
    const results = await Promise.all(urls.map((url) => runService(url)));
    console.log("Data has been scraped and saved to JSON files.");
  } catch (error) {
    console.error("Error during scraping:", error);
  }
}

if (isMainThread) {
  run();
} else {
  console.log("Worker thread started with data:", workerData);

  async function scrapeAndSaveInWorker(url, tag) {
    console.log(`Scraping and saving data for URL: ${url}, Tag: ${tag}`);
    try {
      await scrapeAndSave(url, tag);
      parentPort.postMessage({ success: true });
    } catch (error) {
      parentPort.postMessage({ success: false, error: error.message });
    }
  }

  scrapeAndSaveInWorker(workerData.url, workerData.tag);
}

export { run };
