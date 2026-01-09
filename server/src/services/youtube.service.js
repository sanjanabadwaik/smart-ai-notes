import { spawn } from "child_process";
import process from "process";
import path from "path";
import fs from "fs-extra";

import ApiError from "../utils/ApiError.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { ensureUploadDir } from "../utils/file.js";

/* ===============================
   Extract YouTube ID
================================ */
export const extractYouTubeId = (url = "") => {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
};

/* ===============================
   yt-dlp downloader
================================ */
const downloadWithYtDlp = (url, wavPath) =>
  new Promise((resolve, reject) => {
    const yt = spawn(
      "yt-dlp",
      [
        "-f",
        "bestaudio",
        "--extract-audio",
        "--audio-format",
        "wav",
        "--audio-quality",
        "0",
        "--postprocessor-args",
        "ffmpeg:-ac 1 -ar 16000",
        "-o",
        wavPath,
        url,
      ],
      { windowsHide: true }
    );

    yt.on("close", (code) => {
      if (code !== 0 || !fs.existsSync(wavPath)) {
        reject(new Error("yt-dlp failed"));
      } else {
        resolve(wavPath);
      }
    });
  });

/* ===============================
   MAIN EXPORT
================================ */
export const downloadYoutubeAudio = async (url) => {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    throw new ApiError(
      400,
      "Invalid YouTube URL",
      [],
      ERROR_CODES.YOUTUBE_INVALID_URL
    );
  }

  const uploadDir = ensureUploadDir();
  const wavPath = path.join(uploadDir, `youtube-${videoId}-${Date.now()}.wav`);

  try {
    return await downloadWithYtDlp(url, wavPath);
  } catch (err) {
    if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

    throw new ApiError(
      502,
      "Failed to download YouTube audio",
      [{ message: err.message }],
      ERROR_CODES.YOUTUBE_AUDIO_DOWNLOAD_FAILED
    );
  }
};
