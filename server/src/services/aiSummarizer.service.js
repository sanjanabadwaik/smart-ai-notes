import {
  runWithGeminiModel,
  handleGeminiFailure,
} from "../config/gemini.js";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const summaryPrompts = {
  short: "Provide a concise paragraph summary along with 3 bullet highlights.",
  detailed:
    "Craft a detailed multi-paragraph summary, include key insights, numbered takeaways, and study suggestions.",
  bullet:
    "Return a bullet-point outline with hierarchy, key terms, and action items for revision.",
};

export const generateSummary = async ({
  text,
  summaryType = "short",
  language = "English",
}) => {
  if (!text) throw new ApiError(400, "No text provided for summarization");

  const prompt = `
Language: ${language}
Summary Type: ${summaryType}

Content:
${text}

Instructions:
${summaryPrompts[summaryType] || summaryPrompts.short}

Respond ONLY in valid JSON with keys:
- notes (string)
- keyPoints (array)
- highlights (array)
`;

  try {
    const content = await runWithGeminiModel(
      env.gemini.summaryModel,
      async (model) => {
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
    );

  let parsed = {};
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    parsed = { notes: content };
  }

    return {
      notes: parsed.notes || "",
      keyPoints: parsed.keyPoints || [],
      highlights: parsed.highlights || [],
    };
  } catch (error) {
    handleGeminiFailure(error);
  }
};
