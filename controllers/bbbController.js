import { scrapeAndSave } from "../services/ScrapingService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeAndSaveData(req, res) {
  const tag = "bbb";
  const url = "https://gshow.globo.com/realities/bbb/";

  try {
    await scrapeAndSave(url, tag);
    res.status(200).json({ message: "Data scraped and saved successfully." });
  } catch (error) {
    console.error("Error scraping and saving data:", error);
    res.status(500).json(error, { error: "Error scraping and saving data" });
  }
}

function getScrapedData(req, res) {
  const dataFilePath = path.join(__dirname, "..", "public", "bbb.json");
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json(err, { error: "Error reading data file" });
      return;
    }
    res.json(JSON.parse(data));
  });
}

function getByName(req, res) {
  const dataFilePath = path.join(__dirname, "..", "public", "bbb.json");
  const { name } = req.query;

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading data file" });
      return;
    }

    const jsonData = JSON.parse(data);
    const matchingPosts = jsonData.posts.filter((p) =>
      p.title.toLowerCase().includes(name.toLowerCase())
    );

    if (matchingPosts.length > 0) {
      res.json({ matchingPosts, count: matchingPosts.length });
    } else {
      res.status(404).json({ error: "No posts found with that name" });
    }
  });
}

function getSingleScrapedData(req, res) {
  const dataFilePath = path.join(__dirname, "..", "public", "bbb.json");
  const postId = req.params.id;

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading data file" });
      return;
    }

    const jsonData = JSON.parse(data);
    const post = jsonData.posts.find((p) => p.id === postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "post not found" });
    }
  });
}

function deleteScrapedData(req, res) {
  const dataFilePath = path.join(__dirname, "..", "public", "bbb.json");
  const postId = req.params.id;

  fs.readFile(dataFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading file" });
    }

    let jsonData = JSON.parse(data);
    const postIdex = jsonData.posts.findIndex((p) => p.id === postId);

    if (postIdex !== -1) {
      jsonData.posts.splice(postIdex, 1);
      fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 3));
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
}

function editScrapedData(req, res) {
  const dataFilePath = path.join(__dirname, "..", "public", "bbb.json");
  const postId = req.params.id;
  const updatedData = req.body;

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading data file" });
      return;
    }

    let jsonData = JSON.parse(data);
    const postIndex = jsonData.posts.findIndex((p) => p.id === postId);

    if (postIndex !== -1) {
      jsonData.posts[postIndex] = {
        ...jsonData.posts[postIndex],
        ...updatedData,
      };

      fs.writeFile(
        dataFilePath,
        JSON.stringify(jsonData, null, 2),
        (writeErr) => {
          if (writeErr) {
            res.status(500).json({ error: "Error writing to data file" });
            return;
          }
          res.json({ message: "Post updated successfully" });
        }
      );
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });
}

export {
  getByName,
  getScrapedData,
  scrapeAndSaveData,
  getSingleScrapedData,
  deleteScrapedData,
  editScrapedData,
};
