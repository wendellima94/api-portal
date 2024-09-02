import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ScrapingRoutes from "./routes/ScrapingRoutes.js";
import HoroscopeRoutes from "./routes/HoroscopeRoutes.js";
import BbbRoutes from "./routes/BbbRoutes.js";
import TerraRoutes from "./routes/TerraRoutes.js";
import CategoriesRoutes from "./routes/CategoriesRoutes.js";

import cors from "cors";
// import { run } from "./workers/worker.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/fashionandhealth", ScrapingRoutes);
app.use("/api/v1/horoscope", HoroscopeRoutes);
app.use("/api/v1/bbb", BbbRoutes);
app.use("/api/v1/terra-sports", TerraRoutes);
app.use("/api/v1/categories", CategoriesRoutes);

export default app;
