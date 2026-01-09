import fs from "fs";
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

let pptxParserPromise;
const loadPptxParser = () => {
  if (!pptxParserPromise) {
    pptxParserPromise = import("pptx-parser").then((mod) => mod.default || mod);
  }
  return pptxParserPromise;
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
  const { parse } = await loadPptxParser();
  const presentation = await parse(filePath);
  return presentation.slides
    .map(
      (slide, index) =>
        `Slide ${index + 1}:\n${slide.texts?.join("\n") || ""}`
    )
    .join("\n\n");
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
  } finally {
    await removeFileSafe(filePath);
  }
};
