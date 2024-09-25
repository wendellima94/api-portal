import express from "express";
import path from "path";
import helmet from "helmet";
import xss from "xss-clean";
import { fileURLToPath } from "url";
import ScrapingRoutes from "./routes/ScrapingRoutes.js";
import HoroscopeRoutes from "./routes/HoroscopeRoutes.js";
import BbbRoutes from "./routes/BbbRoutes.js";
import TerraRoutes from "./routes/TerraRoutes.js";
import CategoriesRoutes from "./routes/CategoriesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import config from "./config.json" assert { type: "json" };
import cors from "cors";
import cookieParser from "cookie-parser";
// import { run } from "./workers/worker.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

helmet({
  crossOriginResourcePolicy: false,
});
app.use(express.json());
app.use(cors());
app.use(xss());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(config.jwtSecretKey));

app.use("/api/v1/fashionandhealth", ScrapingRoutes);
app.use("/api/v1/horoscope", HoroscopeRoutes);
app.use("/api/v1/bbb", BbbRoutes);
app.use("/api/v1/terra-sports", TerraRoutes);
app.use("/api/v1/categories", CategoriesRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);

export default app;
