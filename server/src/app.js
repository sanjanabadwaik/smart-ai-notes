import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp"; 
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import slidesRoutes from "./routes/slides.routes.js";
import qaRoutes from "./routes/qa.routes.js";
import communityRoutes from "./routes/community.routes.js";
import { notFoundHandler } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  rateLimit({ windowMs: env.rateLimit.windowMs, max: env.rateLimit.max })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(hpp());

app.use("/uploads", express.static(path.join(__dirname, "..", env.uploadDir)));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/slides", slidesRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/community", communityRoutes);

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API healthy", env: env.nodeEnv });
});

app.use(notFoundHandler); 
app.use(errorHandler);

export default app;
