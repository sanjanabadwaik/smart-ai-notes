import fs from "fs";
import speech from "@google-cloud/speech";
import ApiError from "../utils/ApiError.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { env } from "../config/env.js";
import { removeFileSafe } from "../utils/file.js";

// -------------------- Client Setup --------------------
const speechClientOptions = {};

if (env.google.projectId) {
  speechClientOptions.projectId = env.google.projectId;
}

if (env.google.credentialsJson) {
  try {
    speechClientOptions.credentials = JSON.parse(env.google.credentialsJson);
  } catch {
    console.warn("[speech] Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON");
  }
} else if (env.google.credentialsPath) {
  speechClientOptions.keyFilename = env.google.credentialsPath;
}

const client = new speech.SpeechClient(speechClientOptions);

// -------------------- Transcription --------------------
export const transcribeMedia = async ({
  filePath,
  language = "en-US",
}) => {
  if (!filePath) {
    throw new ApiError(
      400,
      "Missing file path for transcription",
      [],
      ERROR_CODES.FILE_REQUIRED
    );
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);

    const request = {
      audio: {
        content: fileBuffer.toString("base64"),
      },
      config: {
        encoding: "MP3", // ✅ FIXED
        languageCode: language,
        enableAutomaticPunctuation: true,
      },
    };

    const [response] = await client.recognize(request);

    if (!response.results || response.results.length === 0) {
      throw new Error("Empty transcription response");
    }

    const transcription = response.results
      .map((r) => r.alternatives?.[0]?.transcript || "")
      .join(" ")
      .trim();

    if (!transcription || transcription.length < 20) {
      throw new Error("Transcription too short or invalid");
    }

    return transcription;
  } catch (err) {
    console.error("[speech] Transcription failed:", err);

    throw new ApiError(
      502,
      "Failed to transcribe audio",
      [{ message: err.message }],
      ERROR_CODES.SPEECH_TO_TEXT_FAILED
    );
  } finally {
    await removeFileSafe(filePath);
  }
};
