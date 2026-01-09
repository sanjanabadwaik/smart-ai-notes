import Joi from "joi";

export const generateNotesSchema = Joi.object({
  title: Joi.string().max(120).optional(),
  text: Joi.string().allow("", null),
  youtubeUrl: Joi.string().uri().optional(),
  sourceType: Joi.string().valid("audio", "video", "text", "youtube").default("text"),
  summaryType: Joi.string().valid("short", "detailed", "bullet").default("short"),
  language: Joi.string().default("English"),
  isShared: Joi.boolean().optional(),
});

export const updateShareSchema = Joi.object({
  isShared: Joi.boolean().required(),
});
