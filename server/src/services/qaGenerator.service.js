import { runWithGeminiModel, handleGeminiFailure } from "../config/gemini.js";
import { env } from "../config/env.js";

const typeInstructions = {
  MCQ: [
    "Return 4 answer choices per question, labelled A-D.",
    "Populate `options` as an array of { label, text } objects.",
    "Set `correctOption` to the letter of the right answer and explain why in `answer`.",
  ],
  "Short Answer": [
    "Ask short-answer questions answerable in 2-3 sentences.",
    "Keep `answer` concise but informative and reference the source material.",
  ],
  "Long Answer": [
    "Ask analytical questions requiring multi-paragraph responses.",
    "Provide structured `answer` guidance that references key ideas from the notes.",
  ],
};

const difficultyGuidance = {
  Easy: "Focus on factual recall or direct definitions.",
  Medium:
    "Blend concept understanding with light application or comparison across ideas.",
  Hard: "Lean into synthesis, multi-step reasoning, or scenario-based application.",
};

const MAX_NOTES_CHARS = 12000;

const buildPrompt = ({ notes, questionType, difficulty }) => {
  const trimmed = notes.trim();
  const truncated =
    trimmed.length > MAX_NOTES_CHARS
      ? `${trimmed.slice(0, MAX_NOTES_CHARS)}`
      : trimmed;

  const instructions = typeInstructions[questionType] || typeInstructions.MCQ;
  const difficultyHint =
    difficultyGuidance[difficulty] || difficultyGuidance.Medium;

  return `
You are an academic assessment designer. Create ${questionType} questions
grounded strictly in the provided notes.

Notes length: ${trimmed.length} characters${
    trimmed.length > MAX_NOTES_CHARS
      ? ` (truncated to ${MAX_NOTES_CHARS} chars for the model input).`
      : "."
  }

Notes:
""" 
${truncated}
"""

Expectations:
- Generate between 10 and 20 high-quality questions.
- Difficulty setting: ${difficulty} — ${difficultyHint}
- ${instructions.map((line) => `• ${line}`).join("\n- ")}
- Avoid inventing facts not present in the notes.

Return ONLY valid JSON matching this schema:
{
  "items": [
    {
      "id": "string identifier",
      "type": "${questionType}",
      "difficulty": "${difficulty}",
      "question": "The prompt",
      "options": [
        { "label": "A", "text": "Option A text" },
        { "label": "B", "text": "Option B text" },
        { "label": "C", "text": "Option C text" },
        { "label": "D", "text": "Option D text" }
      ],
      "correctOption": "Letter of correct choice",
      "answer": "Short explanation / reference answer"
    }
  ]
}

If the question type is not MCQ, omit the options array and correctOption but
still include the 'answer' field.
`;
};

const extractItems = (rawContent) => {
  if (!rawContent) {
    return [];
  }

  const withoutFences = rawContent
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  const candidate =
    start !== -1 && end !== -1
      ? withoutFences.slice(start, end + 1)
      : withoutFences;

  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed?.items)) {
      return parsed.items;
    }
  } catch {
    // fall through
  }

  return [];
};

export const generateQA = async ({
  notes,
  questionType = "MCQ",
  difficulty = "Medium",
}) => {
  if (!notes) throw new Error("Notes content required for Q&A generation");

  const prompt = buildPrompt({ notes, questionType, difficulty });

  try {
    const content = await runWithGeminiModel(
      env.gemini.qaModel,
      async (model) => {
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
    );

    return extractItems(content);
  } catch (error) {
    handleGeminiFailure(error);
  }
};
