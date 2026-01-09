import { Router } from "express";
import { convertSlides } from "../controllers/slides.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { validateRequest } from "../middlewares/validate.js";
import { slideConvertSchema } from "../validators/slides.validator.js";

const router = Router();

router.use(protect);

router.post(
  "/convert",
  upload.single("file"),
  validateRequest(slideConvertSchema),
  convertSlides
);

export default router;
