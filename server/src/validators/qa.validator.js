import Joi from "joi";

export const qaGenerateSchema = Joi.object({
  noteId: Joi.string(),
  notes: Joi.string().min(20).messages({
    "string.min": "Provide at least 20 characters of notes.",
  }),
  questionType: Joi.string().valid("MCQ", "Short Answer", "Long Answer").default("MCQ"),
  difficulty: Joi.string().valid("Easy", "Medium", "Hard").default("Medium"),
})
  .or("noteId", "notes")
  .messages({
    "object.missing": "Send a noteId or raw notes to generate questions.",
  });
