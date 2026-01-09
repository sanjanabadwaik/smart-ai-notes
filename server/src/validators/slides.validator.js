import Joi from "joi";

export const slideConvertSchema = Joi.object({
  title: Joi.string().max(120).optional(),
  summaryType: Joi.string().valid("short", "detailed", "bullet").default("bullet"),
  language: Joi.string().default("English"),
  isShared: Joi.boolean().optional(),
});
