import fs from "fs-extra";
import mammoth from "mammoth";
import { createRequire } from "module";

import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiError from "../utils/ApiError.js";
import { downloadYoutubeAudio } from "../services/youtube.service.js";
import { transcribeWithWhisper } from "../utils/whisper.js";
import Note from "../models/Note.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractTextFromDocument = async (file) => {
  if (!file) throw new Error("Document file required");

  const { mimetype, path } = file;

  try {
    // PDF
    if (mimetype === "application/pdf") {
      const require = createRequire(import.meta.url); // create require function
      const pdfParseModule = require("pdf-parse"); // load CommonJS module
      const pdfParse =
        typeof pdfParseModule === "function"
          ? pdfParseModule
          : typeof pdfParseModule.default === "function"
          ? pdfParseModule.default
          : null;

      if (!pdfParse) throw new Error("Cannot find pdf-parse function");

      const buffer = await fs.readFile(path);
      const data = await pdfParse(buffer); // ✅ now works
      return data.text;
    }

    // DOCX
    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path });
      return result.value;
    }

    throw new Error(`Unsupported document type: ${mimetype}`);
  } catch (err) {
    console.error("Error extracting text from document:", err);
    throw new Error("Failed to extract text from document");
  }
};

/**
 * Extract JSON from markdown text containing a JSON code block
 */
const extractJsonFromMarkdown = (markdown) => {
  try {
    const jsonMatch = markdown.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : markdown;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON from markdown:", error);
    try {
      const jsonMatch = markdown.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Fallback JSON parsing failed:", e);
    }
    return null;
  }
};

/**
 * Generate lecture notes
 */
export const generateNotes = async (req, res, next) => {
  try {
    const { sourceType, youtubeUrl, text, summaryType = "detailed" } = req.body;
    let inputText = "";

    // TEXT
    if (sourceType === "text") {
      if (!text?.trim()) throw new ApiError(400, "Text is required");
      inputText = text.trim();
    }

    // YOUTUBE
    else if (sourceType === "youtube") {
      if (!youtubeUrl) throw new ApiError(400, "YouTube URL required");
      const wavPath = await downloadYoutubeAudio(youtubeUrl);
      inputText = await transcribeWithWhisper(wavPath);
      await fs.remove(wavPath);
    }

    // DOCUMENT
    else if (sourceType === "document") {
      if (!req.file) throw new ApiError(400, "PDF or Word file required");
      inputText = await extractTextFromDocument(req.file);
    }

    // UNSUPPORTED
    else {
      throw new ApiError(400, `Unsupported source type: ${sourceType}`);
    }

    // GEMINI AI
    const model = genAI.getGenerativeModel({
      model: "models/gemini-flash-lite-latest",
    });

    const prompt = `
Create ${summaryType} lecture notes.
Return JSON in this format only:

{
  "notes": "",
  "keyPoints": [],
  "highlights": []
}

Input:
${inputText}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const parsed = extractJsonFromMarkdown(rawText);

    res.status(201).json({
      success: true,
      content: parsed?.notes || rawText,
      keyPoints: parsed?.keyPoints || [],
      highlights: parsed?.highlights || [],
    });
  } catch (err) {
    next(err);
  }
};

export const saveNote = async (req, res, next) => {
  try {
    const {
      title,
      content,
      keyPoints = [],
      highlights = [],
      sourceType,
      summaryType,
      language,
      user: userId,
    } = req.body;

    if (!title || !content)
      throw new ApiError(400, "Title and content are required");

    const user = req.user?._id || userId;
    if (!user) throw new ApiError(401, "User authentication required");

    const note = await Note.create({
      title,
      content,
      keyPoints,
      highlights,
      sourceType,
      summaryType,
      language,
      user,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

export const getMyNotes = async (_req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

export const deleteNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) throw new ApiError(404, "Note not found");
    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};
