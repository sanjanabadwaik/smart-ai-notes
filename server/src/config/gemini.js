import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env.js";
import ApiError from "../utils/ApiError.js";

if (!env.gemini.apiKey) {
  console.warn(
    "[gemini] GEMINI_API_KEY missing. AI routes will fail until configured."
  );
}

const DEFAULT_MODEL = "models/gemini-2.0-flash";
const FALLBACK_MODELS = ["models/gemini-flash-lite-latest"];

export const resolveModelName = (model) => {
  const name = model?.trim() || DEFAULT_MODEL;
  return name.startsWith("models/") ? name : `models/${name}`;
};

const normalizeCandidates = (preferredModel) => {
  const candidates = [resolveModelName(preferredModel), ...FALLBACK_MODELS];
  const ordered = [];

  for (const candidate of candidates) {
    if (!ordered.includes(candidate)) {
      ordered.push(candidate);
    }
  }

  return ordered;
};

export const gemini = new GoogleGenerativeAI(env.gemini.apiKey);

export const runWithGeminiModel = async (preferredModel, executor) => {
  const candidates = normalizeCandidates(preferredModel);
  let lastError;

  for (const candidate of candidates) {
    try {
      const model = gemini.getGenerativeModel({ model: candidate });
      const result = await executor(model, candidate);

      if (candidate !== candidates[0]) {
        console.info(
          `[gemini] fell back to ${candidate} after ${candidates[0]} failed.`
        );
      }

      return result;
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.response?.status;
      const retriable = status === 404 || status === 429;

      console.warn(
        `[gemini] model ${candidate} failed (${status || "unknown"}).${
          retriable ? " Attempting fallback..." : ""
        }`
      );

      if (!retriable) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("All Gemini model attempts failed.");
};

export const handleGeminiFailure = (error) => {
  const status =
    error?.status || error?.statusCode || error?.response?.status;

  if (status === 429) {
    throw new ApiError(
      503,
      "AI quota exceeded. Try again later or configure a higher-tier Gemini key."
    );
  }

  if (status === 404) {
    throw new ApiError(
      502,
      "Configured Gemini model is unavailable. Update the GEMINI_*_MODEL values."
    );
  }

  throw error;
};
