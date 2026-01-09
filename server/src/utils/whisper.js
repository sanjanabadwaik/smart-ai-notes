import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const PYTHON_PATH = "C:\\Program Files\\Python313\\python.exe"; // 🔥 IMPORTANT (Windows)
const WHISPER_MODEL = "tiny"; // change to "base" after verified
const WHISPER_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const transcribeWithWhisper = (audioPath) =>
  new Promise((resolve, reject) => {
    console.log("🧠 Whisper transcription started");
    console.log("🎧 Audio file:", audioPath);

    const outputDir = path.dirname(audioPath);
    const txtFile = audioPath.replace(path.extname(audioPath), ".txt");

    const whisper = spawn(
      PYTHON_PATH,
      [
        "-X",
        "utf8", // 🔥 FORCE UTF-8
        "-u",
        "-m",
        "whisper",
        audioPath,
        "--model",
        WHISPER_MODEL,
        "--language",
        "en",
        "--task",
        "transcribe",
        "--output_format",
        "txt",
        "--output_dir",
        outputDir,
        "--verbose",
        "False", // 🔥 PREVENT console Unicode spam
      ],
      {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8", // 🔥 DOUBLE SAFETY
        },
      }
    );

    // ⏱ Timeout safety
    const timer = setTimeout(() => {
      console.error("⏰ Whisper timeout — killing process");
      whisper.kill("SIGKILL");
      reject(new Error("Whisper transcription timed out"));
    }, WHISPER_TIMEOUT);

    whisper.stdout.on("data", (data) => {
      console.log("📝 whisper:", data.toString().trim());
    });

    whisper.stderr.on("data", (data) => {
      console.error("⚠️ whisper:", data.toString().trim());
    });

    whisper.on("error", (err) => {
      clearTimeout(timer);
      console.error("❌ Whisper spawn error:", err);
      reject(err);
    });

    whisper.on("close", (code) => {
      clearTimeout(timer);
      console.log("🔚 Whisper exited with code:", code);

      if (code !== 0) {
        return reject(new Error(`Whisper failed with exit code ${code}`));
      }

      if (!fs.existsSync(txtFile)) {
        return reject(new Error("Whisper output file not found"));
      }

      const transcript = fs.readFileSync(txtFile, "utf-8").trim();

      if (!transcript) {
        return reject(new Error("Whisper produced empty transcript"));
      }

      console.log("✅ Transcription completed");
      resolve(transcript);
    });
  });
