import express from "express";
import {
  getScrapedData,
  scrapeAndSaveData,
  getSingleScrapedData,
  deleteScrapedData,
  editScrapedData,
  getByName,
} from "../controllers/bbbController.js";

const router = express.Router();

router.post("/", scrapeAndSaveData);
router.get("/data", getScrapedData);
router.get("/data/search", getByName);
router.get("/data/:id", getSingleScrapedData);
router.delete("/data/:id", deleteScrapedData);
router.put("/data/:id", editScrapedData);

export default router;
