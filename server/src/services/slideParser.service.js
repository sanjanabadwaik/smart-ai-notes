import fs from "fs";
import unzipper from "unzipper";
import { gemini, resolveModelName } from "../config/gemini.js";
import { env } from "../config/env.js";
import { removeFileSafe } from "../utils/file.js";

let pdfParserPromise;
const loadPdfParser = () => {
  if (!pdfParserPromise) {
    pdfParserPromise = import("pdf-parse").then((mod) => mod.default || mod);
  }
  return pdfParserPromise;
};

const readFileBuffer = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => (err ? reject(err) : resolve(data)));
  });

const extractPdfText = async (filePath) => {
  const dataBuffer = await readFileBuffer(filePath);
  const pdf = await loadPdfParser();
  const parsed = await pdf(dataBuffer);
  return parsed.text;
};

const extractPptText = async (filePath) => {
  const directory = await unzipper.Open.file(filePath);
  const slideEntries = directory.files
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/i.test(entry.path))
    .sort((a, b) => {
      const aNum = Number(a.path.match(/slide(\d+)\.xml/i)?.[1] || 0);
      const bNum = Number(b.path.match(/slide(\d+)\.xml/i)?.[1] || 0);
      return aNum - bNum;
    });

  const texts = [];
  for (const entry of slideEntries) {
    const xml = (await entry.buffer()).toString("utf-8");
    const slideNumber = Number(entry.path.match(/slide(\d+)\.xml/i)?.[1] || 0);
    const parts = [];

    const textRegex = /<a:t>([\s\S]*?)<\/a:t>/gi;
    let match;
    while ((match = textRegex.exec(xml))) {
      const raw = match[1] || "";
      const decoded = raw
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      if (decoded) parts.push(decoded);
    }

    if (parts.length) {
      texts.push(`Slide ${slideNumber || texts.length + 1}:\n${parts.join("\n")}`);
    }
  }

  return texts.join("\n\n");
};

export const convertSlidesToNotes = async ({
  filePath,
  summaryType = "bullet",
  language = "English",
}) => {
  if (!filePath) throw new Error("Missing slide file");

  try {
    const extension = filePath.split(".").pop().toLowerCase();
    let extractedText = "";

    if (extension === "pdf") {
      extractedText = await extractPdfText(filePath);
    } else if (extension === "pptx") {
      extractedText = await extractPptText(filePath);
    } else {
      throw new Error("Unsupported slide format. Upload PDF or PPTX.");
    }

    if (!extractedText?.trim()) {
      throw new Error("No readable text found in slides.");
    }

    const prompt = `
Language: ${language}
Summary Type: ${summaryType}

Content extracted from slides:
${extractedText.slice(0, 12000)}

Instructions:
Create a structured set of notes including:
- overview
- sections (array of { title, bullets[] })
- takeaways (array)

Respond ONLY in valid JSON.
`;

    const model = gemini.getGenerativeModel({
      model: resolveModelName(env.gemini.summaryModel),
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    let parsed = {};
    try {
      parsed = JSON.parse(
        content.replace(/```json|```/g, "").trim()
      );
    } catch (err) {
      console.error("Invalid JSON from Gemini:", content);
      throw new Error("Failed to parse AI response");
    }

    return parsed;
  } catch (err) {
    // Graceful fallback for quota/network errors: return mock structured notes
    if (
      err?.status === 429 ||
      err?.message?.includes("quota") ||
      err?.message?.includes("GoogleGenerativeAIFetchError")
    ) {
      console.warn("Gemini quota exceeded; returning mock structured notes for local testing");
      return {
        overview: "Mock overview for local testing (Gemini quota exceeded).",
        sections: [
          {
            title: "Mock Section 1",
            bullets: [
              "Extracted point from slide 1",
              "Extracted point from slide 2",
              "Extracted point from slide 3",
            ],
          },
          {
            title: "Mock Section 2",
            bullets: [
              "Key concept from later slides",
              "Supporting detail",
              "Example or illustration",
            ],
          },
        ],
        takeaways: [
          "Main takeaway 1",
          "Main takeaway 2",
          "Main takeaway 3",
        ],
      };
    }
    // Re-throw other unexpected errors
    throw err;
  } finally {
    await removeFileSafe(filePath);
  }
};
