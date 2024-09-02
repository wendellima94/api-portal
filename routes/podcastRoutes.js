import express from "express";
import {
  getScrapedData,
  scrapeAndSaveData,
} from "../controllers/podcastController.js";

const router = express.Router();

router.post("/", scrapeAndSaveData);
router.get("/data", getScrapedData);

export default router;
