import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../../.env.production")
      : path.resolve(__dirname, "../../.env"),
});

const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "GEMINI_API_KEY",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(
      `[env] Missing ${key}. Certain features may not work as expected.`
    );
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  youtubeCookie: process.env.YOUTUBE_COOKIE || "",

  jwt: {
    secret: process.env.JWT_SECRET || "changeme",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },

  uploadDir: process.env.UPLOAD_DIR || "tmp/uploads",

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    qaModel: process.env.GEMINI_QA_MODEL || "gemini-2.0-flash",
    summaryModel: process.env.GEMINI_SUMMARY_MODEL || "gemini-2.0-flash",
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },

  google: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || "",
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
    credentialsJson: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "",
  },
};
