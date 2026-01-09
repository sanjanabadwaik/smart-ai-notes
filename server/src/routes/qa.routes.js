import { Router } from "express";
import { generateQuestions } from "../controllers/qa.controller.js";
import { protect } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validate.js";
import { qaGenerateSchema } from "../validators/qa.validator.js";

const router = Router();

router.use(protect);

router.post("/generate", validateRequest(qaGenerateSchema), generateQuestions);

export default router;
